'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { Button } from './ui/button'
import { ClientOnly } from './providers/ClientOnly'
import { LogOut, ChevronDown, User } from 'lucide-react'
import { useState, useEffect } from 'react'
import { getUserProfile, supabase } from '@/lib/supabase'
import Link from 'next/link'
import { getDisplayName } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

export function WalletButton() {
  const { connected, publicKey, disconnect } = useWallet()
  const [username, setUsername] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  // Function to load user profile
  const loadProfile = async () => {
    if (!publicKey) return
    try {
      console.log('Loading profile for wallet:', publicKey.toBase58())
      const profile = await getUserProfile(publicKey.toBase58())
      console.log('Profile loaded:', profile)
      if (profile?.username) {
        setUsername(profile.username)
      } else {
        setUsername(null)
      }
    } catch (err) {
      console.error('Error loading profile:', err)
      setUsername(null)
    }
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && connected) {
      loadProfile()
    } else {
      setUsername(null)
    }
  }, [publicKey, connected, mounted])

  // Subscribe to profile updates
  useEffect(() => {
    if (!publicKey) return

    console.log('Setting up profile subscription for wallet:', publicKey.toBase58())
    const subscription = supabase
      .channel('public:users')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'users',
          filter: `wallet_address=eq.${publicKey.toBase58()}`
        }, 
        (payload) => {
          console.log('Profile update received:', payload)
          loadProfile() // Reload profile when changes occur
        }
      )
      .subscribe()

    return () => {
      console.log('Cleaning up profile subscription')
      subscription.unsubscribe()
    }
  }, [publicKey])

  if (!mounted) {
    return null
  }

  if (!connected) {
    return (
      <div className="min-w-[200px] flex justify-end">
        <WalletMultiButton />
      </div>
    )
  }

  return (
    <ClientOnly>
      <div className="flex flex-col items-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              className="flex flex-col items-center py-2 h-auto gap-1"
            >
              <div className="flex items-center gap-2">
                {username && (
                  <div className="font-medium text-sm">
                    {username}
                  </div>
                )}
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="font-mono text-xs text-muted-foreground">
                {publicKey?.toBase58().slice(0, 4)}...
                {publicKey?.toBase58().slice(-4)}
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuItem asChild>
              <Link href="/profile" className="flex items-center cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={disconnect}
              className="text-red-600 focus:text-red-600 cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Disconnect
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </ClientOnly>
  )
} 