'use client'

import { Dataset } from '@/types/dataset'
import { Button } from './ui/button'
import { Heart, Trash2, Pencil, Tag, Plus } from 'lucide-react'
import { useState, useEffect } from 'react'
import { likeDataset, uploadDatasetFile, deleteDataset, getLikedDatasets, toggleLike, getDatasetById, updateDataset, getAllTopics } from '@/lib/supabase'
import { Input } from './ui/input'
import { useRouter } from 'next/navigation'
import { useWallet } from '@solana/wallet-adapter-react'
import { getDisplayName } from '@/lib/utils'
import { EditDatasetModal } from './EditDatasetModal'
import { Badge } from './ui/badge'
import { TopicInput } from './ui/topic-input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { toast } from 'sonner'

interface DatasetDetailsProps {
  datasetId: string
}

export function DatasetDetails({ datasetId }: DatasetDetailsProps) {
  const { publicKey } = useWallet()
  const router = useRouter()
  const [dataset, setDataset] = useState<Dataset | null>(null)
  const [likes, setLikes] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [isLiking, setIsLiking] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditingTopics, setIsEditingTopics] = useState(false)
  const [existingTopics, setExistingTopics] = useState<string[]>([])
  const [pendingTopics, setPendingTopics] = useState(dataset?.topics || [])
  const [isUpdating, setIsUpdating] = useState(false)
  
  const isOwner = publicKey?.toBase58() === dataset?.created_by

  useEffect(() => {
    async function loadDataset() {
      try {
        setIsLoading(true)
        const data = await getDatasetById(datasetId)
        if (data) {
          setDataset(data)
          setLikes(data.likes)
        }
      } catch (err) {
        setError('Failed to load dataset')
        console.error('Error loading dataset:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadDataset()
  }, [datasetId])

  useEffect(() => {
    async function checkIfLiked() {
      if (!publicKey) return
      try {
        const likedDatasets = await getLikedDatasets(publicKey.toBase58())
        setIsLiked(likedDatasets.has(dataset?.id))
      } catch (error) {
        console.error('Error checking liked status:', error)
      }
    }

    checkIfLiked()
  }, [publicKey, dataset?.id])

  useEffect(() => {
    loadTopics()
  }, [])

  async function loadTopics() {
    try {
      const topics = await getAllTopics()
      setExistingTopics(topics)
    } catch (error) {
      console.error('Error loading topics:', error)
    }
  }

  async function handleLikeClick() {
    if (!publicKey) {
      alert('Please connect your wallet to like datasets')
      return
    }

    try {
      setIsLiking(true)
      const newLikeCount = await toggleLike(dataset?.id, publicKey.toBase58())
      setLikes(newLikeCount)
      setIsLiked(!isLiked)
    } catch (error) {
      console.error('Error toggling like:', error)
    } finally {
      setIsLiking(false)
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploadError(null)
      setIsUploading(true)
      await uploadDatasetFile(dataset?.id, file)
      // Refresh the page to show updated file info
      window.location.reload()
    } catch (error) {
      console.error('Error uploading file:', error)
      setUploadError(error instanceof Error ? error.message : 'Failed to upload file')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async () => {
    if (!publicKey) {
      alert('Please connect your wallet first')
      return
    }

    if (!confirm('Are you sure you want to delete this dataset?')) return
    
    try {
      setIsDeleting(true)
      await deleteDataset(dataset?.id, publicKey.toBase58())
      router.push('/')
    } catch (error) {
      console.error('Error deleting dataset:', error)
      alert(error instanceof Error ? error.message : 'Failed to delete dataset')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleUpdate = () => {
    window.location.reload() // Refresh to show updated data
  }

  async function handleUpdateTopics() {
    if (!isOwner || !dataset) return

    try {
      setIsUpdating(true)
      const updatedDataset = await updateDataset(dataset.id, {
        topics: pendingTopics
      })
      
      if (updatedDataset) {
        setDataset(updatedDataset)
        setIsEditingTopics(false)
        toast.success('Topics updated successfully')
      }
    } catch (error) {
      console.error('Error updating topics:', error)
      toast.error('Failed to update topics. Please try again.')
    } finally {
      setIsUpdating(false)
    }
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading dataset...</div>
  }

  if (error || !dataset) {
    return <div className="text-center py-8 text-red-500">{error || 'Dataset not found'}</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <div className="flex justify-between items-start gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">{dataset.name}</h1>
            <p className="text-gray-600">{dataset.description}</p>
          </div>
          
          <div className="flex items-center gap-2">
            {isOwner && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsEditModalOpen(true)}
                  className="h-8 w-8"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="h-8 w-8"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="text-sm text-gray-500">Upload Date</div>
            <div>{new Date(dataset.upload_date).toLocaleDateString()}</div>
          </div>

          <div className="space-y-2">
            <div className="text-sm text-gray-500">Size</div>
            <div>{dataset.size} MB</div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-sm font-medium text-gray-500">Topics</h2>
                
                {isOwner && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditingTopics(true)}
                    className="h-6 px-2"
                  >
                    <Pencil className="h-3 w-3 mr-1" />
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {dataset.topics && dataset.topics.length > 0 ? (
                  dataset.topics.map(topic => (
                    <Badge key={topic} variant="secondary">
                      {topic}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No topics assigned</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm text-gray-500">License</div>
            <div>{dataset.license}</div>
          </div>

          <div className="space-y-2">
            <div className="text-sm text-gray-500">Visibility</div>
            <div className="capitalize">{dataset.visibility}</div>
          </div>

          <div className="space-y-2">
            <div className="text-sm text-gray-500">Created By</div>
            <div>{getDisplayName(dataset.author)}</div>
          </div>
        </div>

        {isOwner && !dataset.file_url && (
          <div className="mt-8 p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Upload Dataset File</h2>
            {uploadError && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
                {uploadError}
              </div>
            )}
            <div className="space-y-2">
              <Input
                type="file"
                accept=".csv,.json,.txt"
                onChange={handleFileUpload}
                disabled={isUploading}
              />
              <p className="text-sm text-gray-500">
                Supported formats: CSV, JSON, TXT
              </p>
            </div>
          </div>
        )}

        {dataset.file_url && (
          <div className="bg-white rounded-lg border mt-8">
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold">Dataset Preview</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {/* We'll add dynamic headers based on the dataset */}
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                      Preview coming soon...
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* We'll add the first 10 rows of data here */}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Edit Topics Dialog */}
        <Dialog open={isEditingTopics} onOpenChange={setIsEditingTopics}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Topics</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <TopicInput
                selectedTopics={pendingTopics}
                onTopicAdd={(topic) => {
                  setPendingTopics(prev => [...prev, topic])
                }}
                onTopicRemove={(topic) => {
                  setPendingTopics(prev => prev.filter(t => t !== topic))
                }}
                existingTopics={existingTopics}
                placeholder="Add topics..."
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setPendingTopics(dataset.topics || [])
                  setIsEditingTopics(false)
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateTopics}
                disabled={isUpdating}
              >
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <EditDatasetModal
        dataset={dataset}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onUpdate={handleUpdate}
      />
    </div>
  )
} 