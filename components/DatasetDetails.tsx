'use client'

import { Dataset } from '@/types/dataset'
import { Button } from './ui/button'
import { Heart, ArrowLeft } from 'lucide-react'
import { useState, useEffect } from 'react'
import { likeDataset, uploadDatasetFile, deleteDataset, getLikedDatasets, toggleLike } from '@/lib/supabase'
import { Input } from './ui/input'
import { useRouter } from 'next/navigation'
import { useWallet } from '@solana/wallet-adapter-react'
import { getDisplayName } from '@/lib/utils'
import { EditDatasetModal } from './EditDatasetModal'

interface DatasetDetailsProps {
  dataset: Dataset
}

export function DatasetDetails({ dataset }: DatasetDetailsProps) {
  const { publicKey } = useWallet()
  const router = useRouter()
  const [likes, setLikes] = useState(dataset.likes)
  const [isLiked, setIsLiked] = useState(false)
  const [isLiking, setIsLiking] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  
  const isOwner = publicKey?.toBase58() === dataset.created_by

  useEffect(() => {
    async function checkIfLiked() {
      if (!publicKey) return
      try {
        const likedDatasets = await getLikedDatasets(publicKey.toBase58())
        setIsLiked(likedDatasets.has(dataset.id))
      } catch (error) {
        console.error('Error checking liked status:', error)
      }
    }

    checkIfLiked()
  }, [publicKey, dataset.id])

  async function handleLikeClick() {
    if (!publicKey) {
      alert('Please connect your wallet to like datasets')
      return
    }

    try {
      setIsLiking(true)
      const newLikeCount = await toggleLike(dataset.id, publicKey.toBase58())
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
      await uploadDatasetFile(dataset.id, file)
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
      await deleteDataset(dataset.id, publicKey.toBase58())
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold mb-2">{dataset.name}</h1>
            <p className="text-gray-600 mb-4">{dataset.description}</p>
            <p className="text-muted-foreground">
              By {getDisplayName(dataset.author)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {isOwner && (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditModalOpen(true)}
                >
                  Edit
                </Button>
                <Button 
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </Button>
              </>
            )}
            <Button 
              variant="outline" 
              onClick={handleLikeClick}
              disabled={isLiking}
              className={isLiked ? 'text-red-500 hover:text-red-600' : ''}
            >
              <Heart 
                className={`w-4 h-4 mr-2 ${isLiked ? 'fill-current' : ''}`} 
              />
              {likes}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500">Upload Date</div>
            <div className="font-medium">
              {new Date(dataset.upload_date).toLocaleDateString()}
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500">Size</div>
            <div className="font-medium">{dataset.size} MB</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500">Categories</div>
            <div className="flex gap-2 flex-wrap">
              {dataset.category_tags.map(tag => (
                <span 
                  key={tag}
                  className="text-sm bg-gray-200 px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500">Likes</div>
            <div className="font-medium">{likes}</div>
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