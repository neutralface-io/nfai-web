'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { createDataset } from '@/lib/supabase'
import { useWallet } from '@solana/wallet-adapter-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { TopicInput } from './ui/topic-input'
import { getAllTopics } from '@/lib/supabase'

interface CreateDatasetModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function CreateDatasetModal({ isOpen, onClose, onSuccess }: CreateDatasetModalProps) {
  const { publicKey } = useWallet()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    visibility: 'public',
    license: 'MIT',
    topics: [] as string[]
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [existingTopics, setExistingTopics] = useState<string[]>([])

  useEffect(() => {
    async function loadTopics() {
      try {
        const topics = await getAllTopics()
        setExistingTopics(topics)
      } catch (error) {
        console.error('Error loading topics:', error)
      }
    }

    if (isOpen) {
      loadTopics()
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!publicKey) return

    try {
      setIsSubmitting(true)
      await createDataset({
        ...formData,
        wallet_address: publicKey.toBase58()
      })
      onSuccess()
      onClose()
      setFormData({
        name: '',
        description: '',
        visibility: 'public',
        license: 'MIT',
        topics: []
      })
    } catch (error) {
      console.error('Error creating dataset:', error)
      alert('Failed to create dataset')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Dataset</DialogTitle>
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
              existingTopics={existingTopics}
              placeholder="Add topics..."
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Dataset'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 