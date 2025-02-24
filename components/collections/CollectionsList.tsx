'use client'

import { useState, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { Collection } from '@/types/collection'
import { getUserCollections } from '@/lib/supabase'
import { CreateCollectionModal } from './CreateCollectionModal'
import { CollectionCard } from './CollectionCard'

interface CollectionsListProps {
  showCreateModal: boolean
  onCreateModalChange: (show: boolean) => void
}

export function CollectionsList({ showCreateModal, onCreateModalChange }: CollectionsListProps) {
  const { publicKey } = useWallet()
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (publicKey) {
      loadCollections()
    }
  }, [publicKey])

  async function loadCollections() {
    try {
      setLoading(true)
      const data = await getUserCollections(publicKey!.toBase58())
      setCollections(data)
    } catch (error) {
      console.error('Error loading collections:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!publicKey) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Connect your wallet to view your collections
      </div>
    )
  }

  if (loading) {
    return <div className="text-center py-8">Loading collections...</div>
  }

  return (
    <div className="space-y-6">
      {collections.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          You haven't created any collections yet
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
        onOpenChange={onCreateModalChange}
        onSuccess={loadCollections}
      />
    </div>
  )
} 