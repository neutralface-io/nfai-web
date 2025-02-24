'use client'

import { CollectionsList } from '@/components/collections/CollectionsList'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { CreateCollectionModal } from '@/components/collections/CreateCollectionModal'

export default function CollectionsPage() {
  const [showCreateModal, setShowCreateModal] = useState(false)

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Navigation zone */}
      <div className="h-8" />

      {/* Header + Actions zone */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold">Collections</h1>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Collection
        </Button>
      </div>

      {/* Content zone */}
      <CollectionsList showCreateModal={showCreateModal} onCreateModalChange={setShowCreateModal} />
    </div>
  )
} 