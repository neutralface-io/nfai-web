'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { updateDataset } from '@/lib/supabase'
import { Dataset } from '@/types/dataset'
import { useWallet } from '@solana/wallet-adapter-react'

const CATEGORIES = [
  'Text',
  'Image',
  'Audio',
  'Video',
  'Tabular',
  'Time Series',
  'Graph',
  'Other'
]

interface EditDatasetModalProps {
  dataset: Dataset
  isOpen: boolean
  onClose: () => void
  onUpdate: () => void
}

export function EditDatasetModal({ dataset, isOpen, onClose, onUpdate }: EditDatasetModalProps) {
  const { publicKey } = useWallet()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: dataset.name,
    description: dataset.description,
    category_tags: dataset.category_tags,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!publicKey) {
      setError('Please connect your wallet first')
      return
    }

    if (!formData.name.trim()) {
      setError('Dataset name is required')
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      await updateDataset(dataset.id, {
        ...formData,
        created_by: publicKey.toBase58(), // For authorization check
      })

      onUpdate()
      onClose()
    } catch (error) {
      console.error('Error updating dataset:', error)
      setError(error instanceof Error ? error.message : 'Failed to update dataset')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Dataset</DialogTitle>
        </DialogHeader>
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Dataset Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter dataset name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your dataset"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="categories">Categories</Label>
            <Select
              value={formData.category_tags[0]}
              onValueChange={value => setFormData(prev => ({ 
                ...prev, 
                category_tags: [value]
              }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(category => (
                  <SelectItem key={category} value={category.toLowerCase()}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 