'use client'

import { useState, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { Collection } from '@/types/collection'
import { Dataset } from '@/types/dataset'
import { getCollectionById, getDatasets, addToCollection, removeFromCollection, updateCollection, deleteCollection } from '@/lib/supabase'
import { DatasetCard } from '../DatasetCard'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { ArrowLeft, Plus, Search, X, Check, Share2, Trash2, Calendar, HardDrive, Tag, Crown } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '../ui/alert-dialog'
import { useRouter } from 'next/navigation'
import { getDisplayName } from '@/lib/utils'

interface CollectionDetailProps {
  collectionId: string
}

interface CollectionDatasetCardProps {
  dataset: Dataset
  onRemove: (datasetId: string) => void
  isOwner: boolean
}

export function CollectionDetail({ collectionId }: CollectionDetailProps) {
  const { publicKey } = useWallet()
  const router = useRouter()
  const [collection, setCollection] = useState<Collection | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [allDatasets, setAllDatasets] = useState<Dataset[]>([])
  const [searching, setSearching] = useState(false)
  const [editingTitle, setEditingTitle] = useState(false)
  const [editingDescription, setEditingDescription] = useState(false)
  const [pendingTitle, setPendingTitle] = useState('')
  const [pendingDescription, setPendingDescription] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const isOwner = publicKey?.toString() === collection?.created_by

  useEffect(() => {
    loadCollection()
  }, [collectionId])

  useEffect(() => {
    if (showAddDialog) {
      loadAllDatasets()
    }
  }, [showAddDialog])

  async function loadCollection() {
    try {
      setLoading(true)
      const data = await getCollectionById(collectionId)
      setCollection(data)
    } catch (err) {
      setError('Failed to load collection')
      console.error('Error loading collection:', err)
    } finally {
      setLoading(false)
    }
  }

  async function loadAllDatasets() {
    try {
      setSearching(true)
      const data = await getDatasets()
      setAllDatasets(data)
    } catch (error) {
      console.error('Error loading datasets:', error)
      toast.error('Failed to load datasets')
    } finally {
      setSearching(false)
    }
  }

  const handleAddDataset = async (datasetId: string) => {
    try {
      await addToCollection(collectionId, datasetId)
      const addedDataset = allDatasets.find(d => d.id === datasetId)
      if (addedDataset && collection) {
        setCollection({
          ...collection,
          datasets: [...(collection.datasets || []), { dataset: addedDataset }]
        })
      }
      toast.success('Dataset added to collection')
    } catch (error) {
      console.error('Error adding dataset:', error)
      toast.error('Failed to add dataset')
    }
  }

  const handleRemoveDataset = async (datasetId: string) => {
    try {
      await removeFromCollection(collectionId, datasetId)
      
      // Immediately update the UI by filtering out the removed dataset
      setCollection(prev => {
        if (!prev) return prev
        return {
          ...prev,
          datasets: prev.datasets?.filter(item => item.dataset.id !== datasetId)
        }
      })
      
      toast.success('Dataset removed from collection')
    } catch (error) {
      console.error('Error removing dataset:', error)
      toast.error('Failed to remove dataset')
    }
  }

  const handleStartEdit = (field: 'title' | 'description') => {
    if (!isOwner) return
    if (field === 'title') {
      setEditingTitle(true)
      setPendingTitle(collection?.name || '')
    } else {
      setEditingDescription(true)
      setPendingDescription(collection?.description || '')
    }
  }

  const handleSave = async (field: 'title' | 'description') => {
    try {
      if (field === 'title') {
        await updateCollection(collectionId, { name: pendingTitle })
        setCollection(prev => prev ? { ...prev, name: pendingTitle } : prev)
        setEditingTitle(false)
      } else {
        await updateCollection(collectionId, { description: pendingDescription })
        setCollection(prev => prev ? { ...prev, description: pendingDescription } : prev)
        setEditingDescription(false)
      }
      toast.success('Collection updated')
    } catch (error) {
      console.error('Error updating collection:', error)
      toast.error('Failed to update collection')
    }
  }

  const handleCancel = (field: 'title' | 'description') => {
    if (field === 'title') {
      setEditingTitle(false)
      setPendingTitle('')
    } else {
      setEditingDescription(false)
      setPendingDescription('')
    }
  }

  const filteredDatasets = allDatasets.filter(dataset => {
    // Exclude datasets already in collection
    const isInCollection = collection?.datasets?.some(
      item => item.dataset.id === dataset.id
    )
    if (isInCollection) return false

    // Filter by search query
    if (!searchQuery.trim()) return true
    const query = searchQuery.toLowerCase()
    return (
      dataset.name.toLowerCase().includes(query) ||
      dataset.description.toLowerCase().includes(query)
    )
  })

  const handleDelete = async () => {
    if (!publicKey) return
    
    try {
      setIsDeleting(true)
      await deleteCollection(collectionId)
      toast.success('Collection deleted')
      router.push('/collections')
    } catch (error) {
      console.error('Error deleting collection:', error)
      toast.error('Failed to delete collection')
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading collection...</div>
  }

  if (error || !collection) {
    return <div className="text-center py-8 text-red-500">{error || 'Collection not found'}</div>
  }

  return (
    <>
      <div>
        {/* Header + Actions zone */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold mb-2">{collection.name}</h1>
            <p className="text-muted-foreground">{collection.description || 'No description'}</p>
          </div>
          
          <div className="flex items-center gap-2">
            {isOwner && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setShowAddDialog(true)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setShowDeleteDialog(true)}
                  disabled={isDeleting}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Content zone with remove functionality */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collection.datasets?.map((item) => (
            <CollectionDatasetCard
              key={item.dataset.id}
              dataset={item.dataset}
              onRemove={handleRemoveDataset}
              isOwner={isOwner}
            />
          ))}
        </div>

        {!collection.datasets?.length && (
          <div className="text-center py-8 text-muted-foreground">
            No datasets in this collection yet
          </div>
        )}
      </div>

      {/* Add Dataset Dialog */}
      <Dialog 
        open={showAddDialog} 
        onOpenChange={(open) => {
          setShowAddDialog(open)
          if (!open) {
            setSearchQuery('')  // Clear search when closing
          }
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Datasets</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center gap-2 mb-4">
              <Input
                placeholder="Search datasets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
            </div>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {searching ? (
                <div className="text-center py-4">Loading datasets...</div>
              ) : filteredDatasets.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  {searchQuery.trim() ? 'No matching datasets found' : 'No available datasets'}
                </div>
              ) : (
                filteredDatasets.map((dataset) => (
                  <div
                    key={dataset.id}
                    className="border rounded-lg p-4 hover:bg-gray-50"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="font-medium">{dataset.name}</h3>
                        <p className="text-sm text-gray-500 line-clamp-2">
                          {dataset.description}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleAddDataset(dataset.id)}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Collection</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this collection? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete Collection'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

function CollectionDatasetCard({ dataset, onRemove, isOwner }: CollectionDatasetCardProps) {
  const router = useRouter()
  const { publicKey } = useWallet()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const isDatasetOwner = publicKey?.toBase58() === dataset.created_by

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigation if clicking on an interactive element
    if ((e.target as HTMLElement).closest('button')) {
      return
    }
    router.push(`/datasets/${dataset.id}`)
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    await onRemove(dataset.id)
    setIsDeleting(false)
    setShowDeleteDialog(false)
  }

  return (
    <>
      <div 
        onClick={handleCardClick}
        className={`bg-card border rounded-lg shadow-sm hover:shadow transition-all flex flex-col h-full cursor-pointer ${
          isDatasetOwner ? 'bg-muted/50 border-muted' : ''
        }`}
      >
        <div className="p-6 flex-1">
          {/* Header */}
          <div className="flex justify-between items-start gap-4 mb-4">
            <div className="flex-1">
              <h3 className="font-semibold text-lg truncate">
                {dataset.name}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {dataset.description}
              </p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {isDatasetOwner && (
                <Crown className="h-4 w-4 text-yellow-500 shrink-0" />
              )}
              {dataset.author && (
                <span className="text-sm text-muted-foreground truncate max-w-[100px]">
                  {getDisplayName(dataset.author)}
                </span>
              )}
            </div>
          </div>

          {/* Metadata section */}
          <div className="space-y-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-2 shrink-0" />
              <span>{new Date(dataset.upload_date).toLocaleDateString()}</span>
            </div>

            <div className="flex items-center text-sm text-muted-foreground">
              <HardDrive className="h-4 w-4 mr-2 shrink-0" />
              <span>{dataset.size} MB</span>
            </div>
          </div>
        </div>

        {/* Footer with remove button */}
        <div className="border-t">
          <div className="h-14 px-6 flex items-center justify-end">
            {isOwner && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowDeleteDialog(true)}
                className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Dataset</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove "{dataset.name}" from this collection?
              This won't delete the dataset itself.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Removing...' : 'Remove Dataset'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
} 