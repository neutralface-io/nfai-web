'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
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
import { createDataset } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { useWallet } from '@solana/wallet-adapter-react'

const LICENSE_TYPES = [
  'MIT',
  'Apache-2.0',
  'GPL-3.0',
  'BSD-3-Clause',
  'CC BY 4.0',
  'Public Domain'
]

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

export function CreateDatasetModal() {
  const router = useRouter()
  const { publicKey } = useWallet()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    visibility: 'public',
    category_tags: [] as string[],
    license: LICENSE_TYPES[0],
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

      const params = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        visibility: formData.visibility,
        category_tags: formData.category_tags,
        license: formData.license,
        wallet_address: publicKey.toBase58(),
      }

      console.log('Submitting dataset with params:', params)

      await createDataset(params)
      setIsOpen(false)
      window.location.reload()
    } catch (error) {
      console.error('Error creating dataset:', error)
      if (error instanceof Error) {
        setError(`Failed to create dataset: ${error.message}`)
      } else {
        setError('Failed to create dataset. Please check the console for details.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        setIsOpen(open)
        if (!open) {
          setError(null)
          setFormData({
            name: '',
            description: '',
            visibility: 'public',
            category_tags: [],
            license: LICENSE_TYPES[0],
          })
        }
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Dataset
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Dataset</DialogTitle>
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
            <Label htmlFor="visibility">Visibility</Label>
            <Select
              value={formData.visibility}
              onValueChange={value => setFormData(prev => ({ ...prev, visibility: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="private">Private</SelectItem>
              </SelectContent>
            </Select>
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

          <div className="space-y-2">
            <Label htmlFor="license">License</Label>
            <Select
              value={formData.license}
              onValueChange={value => setFormData(prev => ({ ...prev, license: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select license" />
              </SelectTrigger>
              <SelectContent>
                {LICENSE_TYPES.map(license => (
                  <SelectItem key={license} value={license}>
                    {license}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Dataset'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 