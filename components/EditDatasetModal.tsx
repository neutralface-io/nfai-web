'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { Dataset } from '@/types/dataset'
import { updateDataset } from '@/lib/supabase'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { TopicInput } from './ui/topic-input'

interface EditDatasetModalProps {
  dataset: Dataset
  isOpen: boolean
  onClose: () => void
  onUpdate: () => void
}

export function EditDatasetModal({ dataset, isOpen, onClose, onUpdate }: EditDatasetModalProps) {
  const [formData, setFormData] = useState({
    name: dataset.name,
    description: dataset.description,
    visibility: dataset.visibility,
    license: dataset.license,
    topics: dataset.topics || []
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsSubmitting(true)
      await updateDataset(dataset.id, formData)
      onUpdate()
      onClose()
    } catch (error) {
      console.error('Error updating dataset:', error)
      alert('Failed to update dataset')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Dataset</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              required
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
            <Label htmlFor="license">License</Label>
            <Select
              value={formData.license}
              onValueChange={value => setFormData(prev => ({ ...prev, license: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select license" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MIT">MIT</SelectItem>
                <SelectItem value="Apache-2.0">Apache 2.0</SelectItem>
                <SelectItem value="GPL-3.0">GPL 3.0</SelectItem>
                <SelectItem value="BSD-3-Clause">BSD 3-Clause</SelectItem>
                <SelectItem value="CC BY 4.0">CC BY 4.0</SelectItem>
                <SelectItem value="Public Domain">Public Domain</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Topics</Label>
            <TopicInput
              selectedTopics={formData.topics}
              onTopicAdd={(topic) => {
                setFormData(prev => ({
                  ...prev,
                  topics: [...prev.topics, topic]
                }))
              }}
              onTopicRemove={(topic) => {
                setFormData(prev => ({
                  ...prev,
                  topics: prev.topics.filter(t => t !== topic)
                }))
              }}
              existingTopics={[]} // We'll fetch these from the database
              placeholder="Add topics..."
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 