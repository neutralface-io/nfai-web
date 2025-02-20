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
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    visibility: 'public',
    categories: [] as string[],
    license: LICENSE_TYPES[0], // Set a default license
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    // Validate form data
    if (!formData.name.trim()) {
      setError('Dataset name is required')
      return
    }
    if (!formData.description.trim()) {
      setError('Description is required')
      return
    }
    if (formData.categories.length === 0) {
      setError('Please select at least one category')
      return
    }
    if (!formData.license) {
      setError('Please select a license')
      return
    }

    try {
      setIsLoading(true)
      console.log('Submitting form data:', formData)
      
      const dataset = await createDataset({
        name: formData.name.trim(),
        description: formData.description.trim(),
        visibility: formData.visibility,
        category_tags: formData.categories,
        license: formData.license,
      })

      console.log('Dataset created:', dataset)
      setIsOpen(false)
      // Reset form data
      setFormData({
        name: '',
        description: '',
        visibility: 'public',
        categories: [],
        license: LICENSE_TYPES[0],
      })
      router.push(`/datasets/${dataset.id}`)
      router.refresh()
    } catch (error) {
      console.group('Dataset Creation Error')
      console.error('Error object:', error)
      console.error('Error type:', typeof error)
      console.error('Is Error instance:', error instanceof Error)
      console.error('Error stringified:', JSON.stringify(error, null, 2))
      if (error instanceof Error) {
        console.error('Error name:', error.name)
        console.error('Error message:', error.message)
        console.error('Error stack:', error.stack)
      }
      console.groupEnd()

      // Set a more descriptive error message
      setError(
        error instanceof Error && error.message
          ? error.message
          : 'Failed to create dataset. Please check the console for details.'
      )
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
          // Reset form data and error when closing
          setError(null)
          setFormData({
            name: '',
            description: '',
            visibility: 'public',
            categories: [],
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
              value={formData.categories[0]}
              onValueChange={value => setFormData(prev => ({ ...prev, categories: [value] }))}
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