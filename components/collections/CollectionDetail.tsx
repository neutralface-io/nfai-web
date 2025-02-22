'use client'

import { useEffect, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { Collection } from '@/types/collection'
import { Dataset } from '@/types/dataset'
import { getCollectionById, getDatasets, addToCollection, removeFromCollection, updateCollection } from '@/lib/supabase'
import { DatasetCard } from '../DatasetCard'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { ArrowLeft, Plus, Search, X, Check } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

interface CollectionDetailProps {
  collectionId: string
}

export function CollectionDetail({ collectionId }: CollectionDetailProps) {
  const { publicKey } = useWallet()
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

  const isOwner = publicKey?.toString() === collection?.created_by

  useEffect(() => {
    loadCollection()
  }, [collectionId])

  async function loadCollection() {
    try {
      setLoading(true)
      const data = await getCollectionById(collectionId)
      setCollection(data)
    } catch (error) {
      console.error('Error loading collection:', error)
      toast.error('Failed to load collection')
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
      await loadCollection() // Refresh collection data
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
      dataset.description?.toLowerCase().includes(query)
    )
  })

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }

  if (!collection) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-8 text-gray-500">
          Collection not found
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto">
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/collections">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Collections
              </Button>
            </Link>
          </div>
          {isOwner && (
            <Button onClick={() => {
              setShowAddDialog(true)
              loadAllDatasets()
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Datasets
            </Button>
          )}
        </div>

        {/* Collection Info */}
        <div className="space-y-4">
          <div className="relative group">
            {editingTitle ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={pendingTitle}
                  onChange={(e) => setPendingTitle(e.target.value)}
                  className="text-2xl font-bold bg-transparent border-b border-primary outline-none w-full"
                  autoFocus
                />
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSave('title')}
                    className="h-8 w-8 p-0"
                  >
                    <Check className="h-4 w-4 text-green-500" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCancel('title')}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ) : (
              <h1
                className={`text-2xl font-bold ${isOwner ? 'cursor-pointer hover:text-primary' : ''}`}
                onClick={() => handleStartEdit('title')}
              >
                {collection.name}
              </h1>
            )}
          </div>

          <div className="relative group">
            {editingDescription ? (
              <div className="flex items-start gap-2">
                <textarea
                  value={pendingDescription}
                  onChange={(e) => setPendingDescription(e.target.value)}
                  className="mt-2 text-gray-500 bg-transparent border-b border-primary outline-none w-full resize-none"
                  rows={3}
                  autoFocus
                />
                <div className="flex gap-1 mt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSave('description')}
                    className="h-8 w-8 p-0"
                  >
                    <Check className="h-4 w-4 text-green-500" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCancel('description')}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ) : (
              <p
                className={`mt-2 text-gray-500 ${isOwner ? 'cursor-pointer hover:text-primary' : ''}`}
                onClick={() => handleStartEdit('description')}
              >
                {collection.description || 'No description'}
              </p>
            )}
          </div>
        </div>

        {/* Datasets Grid */}
        {collection.datasets && collection.datasets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collection.datasets.map((item) => (
              <div key={item.dataset.id} className="relative group">
                {isOwner && (
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute -right-2 -top-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleRemoveDataset(item.dataset.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
                <DatasetCard
                  dataset={item.dataset}
                  showLikes={true}
                  hideCollectionButton={true}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No datasets in this collection yet
          </div>
        )}
      </div>

      {/* Add Datasets Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Add Datasets to Collection</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input
                placeholder="Search datasets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
              {searching ? (
                <div className="text-center py-4">Loading datasets...</div>
              ) : filteredDatasets.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  No datasets found
                </div>
              ) : (
                filteredDatasets.map(dataset => (
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
    </div>
  )
} 