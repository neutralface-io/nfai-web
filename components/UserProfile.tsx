'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { getUserProfile, updateUserProfile } from '@/lib/supabase'
import { ClientOnly } from './providers/ClientOnly'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

interface UserProfileData {
  username: string
  email: string
}

export function UserProfile() {
  const { connected, publicKey } = useWallet()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [profileData, setProfileData] = useState<UserProfileData>({
    username: '',
    email: '',
  })

  useEffect(() => {
    async function loadProfile() {
      if (!publicKey) return

      try {
        const profile = await getUserProfile(publicKey.toBase58())
        if (profile) {
          setProfileData({
            username: profile.username || '',
            email: profile.email || '',
          })
        }
      } catch (err) {
        console.error('Error loading profile:', err)
      }
    }

    loadProfile()
  }, [publicKey])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!publicKey) return

    try {
      setIsLoading(true)
      setError(null)

      // Validate username format
      if (profileData.username) {
        if (profileData.username.length < 3) {
          throw new Error('Username must be at least 3 characters long')
        }
        if (!/^[a-zA-Z0-9_-]+$/.test(profileData.username)) {
          throw new Error('Username can only contain letters, numbers, underscores, and hyphens')
        }
      }

      // Validate email format
      if (profileData.email && !profileData.email.includes('@')) {
        throw new Error('Please enter a valid email address')
      }

      const updatedProfile = await updateUserProfile({
        wallet_address: publicKey.toBase58(),
        username: profileData.username || null,
        email: profileData.email || null,
      })

      console.log('Profile updated:', updatedProfile)
      setError('Profile updated successfully!')

      // The WalletButton will automatically update due to the subscription
    } catch (err) {
      console.error('Error updating profile:', err)
      setError(err instanceof Error ? err.message : 'Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  if (!connected) {
    return (
      <div className="text-center py-8">
        Please connect your wallet to view your profile
      </div>
    )
  }

  return (
    <ClientOnly>
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-8"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-50 p-4 rounded-lg mb-8">
            <Label>Wallet Address</Label>
            <div className="font-mono mt-1">{publicKey?.toBase58()}</div>
          </div>

          {error && (
            <div className={`p-3 rounded-md mb-4 ${
              error === 'Profile updated successfully!'
                ? 'bg-green-50 text-green-600'
                : 'bg-red-50 text-red-600'
            }`}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={profileData.username}
                onChange={e =>
                  setProfileData(prev => ({ ...prev, username: e.target.value }))
                }
                placeholder="Enter username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                onChange={e =>
                  setProfileData(prev => ({ ...prev, email: e.target.value }))
                }
                placeholder="Enter email"
              />
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Profile'}
            </Button>
          </form>
        </div>
      </div>
    </ClientOnly>
  )
} 