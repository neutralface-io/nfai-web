'use client'

import { DatasetList } from '@/components/DatasetList'
import { Button } from '@/components/ui/button'
import { Plus, SlidersHorizontal } from 'lucide-react'
import { useState } from 'react'
import { CreateDatasetModal } from '@/components/CreateDatasetModal'

export default function DatasetsPage() {
  const [isFiltersVisible, setIsFiltersVisible] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Navigation zone */}
      <div className="h-8" />

      {/* Header + Actions zone */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-semibold">Datasets</h1>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-muted-foreground"
            onClick={() => setIsFiltersVisible(!isFiltersVisible)}
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
        <CreateDatasetModal>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Upload Dataset
          </Button>
        </CreateDatasetModal>
      </div>

      {/* Content zone */}
      <DatasetList isFiltersVisible={isFiltersVisible} />
    </div>
  )
} 