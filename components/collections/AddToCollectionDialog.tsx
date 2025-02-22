'use client'

import { useState, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
import { Collection } from '@/types/collection'
import { getUserCollections, addToCollection, removeFromCollection } from '@/lib/supabase'
import { toast } from 'sonner'
import { Plus, Check, Loader2 } from 'lucide-react'
import { Dataset } from '@/types/dataset'
import { CreateCollectionModal } from './CreateCollectionModal'
import { useRouter } from 'next/navigation'

interface AddToCollectionDialogProps {
  dataset: Dataset
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddToCollectionDialog({ dataset, open, onOpenChange }: AddToCollectionDialogProps) {
  const router = useRouter()
  const { publicKey } = useWallet()
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    if (publicKey && open) {
      loadCollections()
    }
  }, [publicKey, open])

  async function loadCollections() {
    try {
      setLoading(true)
      const data = await getUserCollections(publicKey!.toString())
      setCollections(data)
    } catch (error) {
      console.error('Error loading collections:', error)
      toast.error('Failed to load collections')
    } finally {
      setLoading(false)
    }
  }

  const isDatasetInCollection = (collection: Collection) => {
    return collection.datasets?.some(item => item.dataset.id === dataset.id)
  }

  const handleCollectionClick = async (collection: Collection) => {
    if (!publicKey) return

    try {
      setProcessing(collection.id)
      const isInCollection = isDatasetInCollection(collection)

      if (isInCollection) {
        await removeFromCollection(collection.id, dataset.id)
        dataset.collection_count = Math.max(0, dataset.collection_count - 1)
        toast.success('Removed from collection')
      } else {
        await addToCollection(collection.id, dataset.id)
        dataset.collection_count += 1
        toast.success('Added to collection')
      }

      await loadCollections() // Refresh collections to update UI
    } catch (error) {
      console.error('Error updating collection:', error)
      toast.error('Failed to update collection')
    } finally {
      setProcessing(null)
    }
  }

  const handleCreateSuccess = () => {
    loadCollections()
    setShowCreateModal(false)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add to Collection</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {loading ? (
              <div className="text-center py-4">Loading collections...</div>
            ) : collections.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-gray-500 mb-4">No collections yet</p>
                <Button onClick={() => setShowCreateModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Collection
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {collections.map(collection => {
                  const isInCollection = isDatasetInCollection(collection)
                  return (
                    <Button
                      key={collection.id}
                      variant={isInCollection ? "secondary" : "outline"}
                      className="w-full justify-between"
                      disabled={processing !== null}
                      onClick={() => handleCollectionClick(collection)}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{collection.name}</span>
                        <span className="text-gray-500">
                          ({collection.datasets?.length || 0} datasets)
                        </span>
                      </div>
                      {processing === collection.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : isInCollection ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                    </Button>
                  )
                })}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <CreateCollectionModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSuccess={handleCreateSuccess}
      />
    </>
  )
} 