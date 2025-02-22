'use client'

import { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Switch } from '../ui/switch'
import { createCollection } from '@/lib/supabase'

interface CreateCollectionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function CreateCollectionModal({ open, onOpenChange, onSuccess }: CreateCollectionModalProps) {
  const { publicKey } = useWallet()
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isPublic, setIsPublic] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!publicKey) return

    try {
      setLoading(true)
      await createCollection({
        name,
        description,
        is_public: isPublic,
        created_by: publicKey.toString(),
      })
      
      // Reset form
      setName('')
      setDescription('')
      setIsPublic(false)
      
      // Close modal and refresh list
      onOpenChange(false)
      onSuccess()
    } catch (error) {
      console.error('Error creating collection:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Collection</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter collection name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your collection"
              rows={3}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="public">Make collection public</Label>
            <Switch
              id="public"
              checked={isPublic}
              onCheckedChange={setIsPublic}
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
              disabled={loading || !name.trim()}
            >
              {loading ? 'Creating...' : 'Create Collection'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 