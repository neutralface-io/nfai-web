'use client'

import { Calendar, Heart, HardDrive, Tag, Crown, FolderPlus, Folders } from 'lucide-react'
import { Button } from './ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'
import Link from 'next/link'
import { Dataset } from '../types/dataset'
import { getDisplayName } from '@/lib/utils'
import { useWallet } from '@solana/wallet-adapter-react'
import { useState, useEffect } from 'react'
import { getLikedDatasets, toggleLike, getUserCollectionCount } from '@/lib/supabase'
import { AddToCollectionDialog } from './collections/AddToCollectionDialog'

interface DatasetCardProps {
  dataset: Dataset
  showLikes?: boolean
  hideCollectionButton?: boolean
}

export function DatasetCard({ 
  dataset, 
  showLikes = true,
  hideCollectionButton = false
}: DatasetCardProps) {
  const { publicKey } = useWallet()
  const isOwner = publicKey?.toBase58() === dataset.created_by
  const [likes, setLikes] = useState(dataset.likes)
  const [isLiked, setIsLiked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showAddToCollection, setShowAddToCollection] = useState(false)
  const [userCollectionCount, setUserCollectionCount] = useState(0)

  useEffect(() => {
    async function loadData() {
      if (!publicKey) return
      try {
        // Check if liked
        const likedDatasets = await getLikedDatasets(publicKey.toBase58())
        setIsLiked(likedDatasets.has(dataset.id))
        
        // Get user's collection count for this dataset
        const count = await getUserCollectionCount(dataset.id, publicKey.toBase58())
        setUserCollectionCount(count)
      } catch (error) {
        console.error('Error loading dataset data:', error)
      }
    }

    loadData()
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
    <>
      <div className={`bg-card border rounded-lg shadow-sm hover:shadow transition-shadow flex flex-col h-full ${
        isOwner ? 'bg-muted/50 border-muted' : ''
      }`}>
        {/* Main content - will grow to fill space */}
        <div className="p-6 flex-1">
          {/* Header */}
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg truncate">
                {dataset.name || 'Untitled Dataset'}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {dataset.description || 'No description available'}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {publicKey && !hideCollectionButton && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddToCollection(true)}
                  className="h-8 w-8 p-0"
                >
                  <FolderPlus className="h-4 w-4" />
                </Button>
              )}
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                {isOwner && (
                  <Crown className="h-4 w-4 text-yellow-500 shrink-0" />
                )}
                <span className="truncate max-w-[100px]">
                  {getDisplayName(dataset.author)}
                </span>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-2 shrink-0" />
              <span>{new Date(dataset.upload_date).toLocaleDateString()}</span>
            </div>

            <div className="flex items-center text-sm text-muted-foreground">
              <HardDrive className="h-4 w-4 mr-2 shrink-0" />
              <span>{dataset.size} MB</span>
            </div>

            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-muted-foreground shrink-0" />
              <div className="flex flex-wrap gap-1">
                {dataset.category_tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-secondary px-2 py-0.5 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer - will stay at bottom */}
        <div className="border-t p-4 mt-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleLikeClick}
              disabled={isLoading}
              className={`gap-2 ${isLiked ? 'text-red-500 hover:text-red-600' : ''}`}
            >
              <Heart className={isLiked ? 'fill-current' : ''} />
              {showLikes && likes}
            </Button>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Folders className="h-4 w-4" />
                    <span>
                      {dataset.collection_count}
                      {userCollectionCount > 0 && (
                        <span className="text-muted-foreground ml-1">({userCollectionCount})</span>
                      )}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>In {dataset.collection_count} total collections</p>
                  {userCollectionCount > 0 && (
                    <p>Including {userCollectionCount} of your collections</p>
                  )}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <Link href={`/datasets/${dataset.id}`}>
            <Button size="sm">View Details</Button>
          </Link>
        </div>
      </div>

      {!hideCollectionButton && (
        <AddToCollectionDialog
          dataset={dataset}
          open={showAddToCollection}
          onOpenChange={setShowAddToCollection}
        />
      )}
    </>
  )
} 