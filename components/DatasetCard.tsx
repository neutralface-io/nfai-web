import { Calendar, Heart, HardDrive, Tag, Crown } from 'lucide-react'
import { Button } from './ui/button'
import Link from 'next/link'
import { Dataset } from '../types/dataset'
import { getDisplayName } from '@/lib/utils'
import { useWallet } from '@solana/wallet-adapter-react'
import { useState, useEffect } from 'react'
import { getLikedDatasets, toggleLike } from '@/lib/supabase'

interface DatasetCardProps {
  dataset: Dataset
}

export function DatasetCard({ dataset }: DatasetCardProps) {
  const { publicKey } = useWallet()
  const isOwner = publicKey?.toBase58() === dataset.created_by
  const [likes, setLikes] = useState(dataset.likes)
  const [isLiked, setIsLiked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

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
      setIsLoading(true)
      console.log('Attempting to toggle like...')
      const newLikeCount = await toggleLike(dataset.id, publicKey.toBase58())
      console.log('Like toggled successfully, new count:', newLikeCount)
      setLikes(newLikeCount)
      setIsLiked(!isLiked)
    } catch (error) {
      console.error('Error toggling like:', error)
      alert('Failed to toggle like. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!dataset) {
    return null // Or return a placeholder/skeleton
  }

  return (
    <div className={`border rounded-lg p-4 space-y-4 ${
      isOwner ? 'bg-gray-50 border-gray-300' : ''
    }`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium">{dataset.name || 'Untitled Dataset'}</h3>
          <p className="text-sm text-muted-foreground">
            {dataset.description || 'No description available'}
          </p>
        </div>
        <div className="text-sm text-muted-foreground flex items-center gap-1">
          {isOwner && (
            <Crown className="w-4 h-4 text-yellow-500" />
          )}
          {getDisplayName(dataset.author)}
        </div>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-gray-500">
          <Calendar className="w-4 h-4 mr-2" />
          <span className="text-sm">{new Date(dataset.upload_date).toLocaleDateString()}</span>
        </div>
        
        <div className="flex items-center text-gray-500">
          <HardDrive className="w-4 h-4 mr-2" />
          <span className="text-sm">{dataset.size} MB</span>
        </div>
        
        <div className="flex items-center text-gray-500">
          <Tag className="w-4 h-4 mr-2" />
          <div className="flex gap-2">
            {dataset.category_tags.map((tag) => (
              <span
                key={tag}
                className="text-sm bg-gray-100 px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleLikeClick}
          disabled={isLoading}
          className={isLiked ? 'text-red-500 hover:text-red-600' : ''}
        >
          <Heart 
            className={`w-4 h-4 mr-2 ${isLiked ? 'fill-current' : ''}`} 
          />
          {likes}
        </Button>
        <Link href={`/datasets/${dataset.id}`}>
          <Button size="sm">View Details</Button>
        </Link>
      </div>
    </div>
  )
} 