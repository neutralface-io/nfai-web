'use client'

import { Dataset } from '@/types/dataset'
import { Button } from './ui/button'
import { Heart, ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { likeDataset, uploadDatasetFile } from '@/lib/supabase'
import { Input } from './ui/input'
import { useRouter } from 'next/navigation'

interface DatasetDetailsProps {
  dataset: Dataset
}

export function DatasetDetails({ dataset }: DatasetDetailsProps) {
  const router = useRouter()
  const [likes, setLikes] = useState(dataset.likes)
  const [isLiking, setIsLiking] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  async function handleLike() {
    try {
      setIsLiking(true)
      await likeDataset(dataset.id)
      setLikes(prev => prev + 1)
    } catch (error) {
      console.error('Error liking dataset:', error)
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
          </div>
          <Button 
            variant="outline" 
            onClick={handleLike}
            disabled={isLiking}
          >
            <Heart className="w-4 h-4 mr-2" />
            {likes}
          </Button>
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

        {!dataset.file_url && (
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
    </div>
  )
} 