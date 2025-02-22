'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { shareCollection } from '@/lib/supabase'
import { Collection } from '@/types/collection'
import { toast } from 'sonner'

interface ShareCollectionDialogProps {
  collection: Collection
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ShareCollectionDialog({ collection, open, onOpenChange }: ShareCollectionDialogProps) {
  const [loading, setLoading] = useState(false)
  const [walletAddress, setWalletAddress] = useState('')

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!walletAddress.trim()) return

    try {
      setLoading(true)
      await shareCollection(collection.id, walletAddress.trim())
      
      // Reset form and close dialog
      setWalletAddress('')
      onOpenChange(false)
      toast.success('Collection shared successfully')
    } catch (error) {
      console.error('Error sharing collection:', error)
      toast.error('Failed to share collection')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Collection</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleShare} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="wallet">Wallet Address</Label>
            <Input
              id="wallet"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="Enter recipient's wallet address"
              required
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !walletAddress.trim()}
            >
              {loading ? 'Sharing...' : 'Share'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 