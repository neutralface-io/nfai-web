'use client'

import { useState, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { Collection } from '@/types/collection'
import { getUserCollections } from '@/lib/supabase'
import { Button } from '../ui/button'
import { Plus } from 'lucide-react'
import { CreateCollectionModal } from './CreateCollectionModal'
import { CollectionCard } from './CollectionCard'

export function CollectionsList() {
  const { publicKey } = useWallet()
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    if (publicKey) {
      loadCollections()
    }
  }, [publicKey])

  async function loadCollections() {
    try {
      setLoading(true)
      const data = await getUserCollections(publicKey!.toString())
      setCollections(data)
    } catch (error) {
      console.error('Error loading collections:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!publicKey) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-8 text-gray-500">
          Please connect your wallet to view collections
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto">
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">My Collections</h1>
            <Button
              variant="outline"
              size="sm"
              className="hidden md:flex"
              onClick={() => setShowCreateModal(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Collection
            </Button>
          </div>
          <Button
            className="md:hidden"
            size="sm"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Collection
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading collections...</div>
        ) : collections.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="mb-4">No collections yet.</p>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create your first collection
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((collection) => (
              <CollectionCard 
                key={collection.id} 
                collection={collection}
                onUpdate={loadCollections}
              />
            ))}
          </div>
        )}

        <CreateCollectionModal
          open={showCreateModal}
          onOpenChange={setShowCreateModal}
          onSuccess={loadCollections}
        />
      </div>
    </div>
  )
} 