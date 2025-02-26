'use client'

import { CreateDatasetButton } from '@/components/CreateDatasetButton'
import { DatasetList } from '@/components/DatasetList'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'

export default function DatasetsPage() {
  const [isFiltersVisible, setIsFiltersVisible] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Navigation zone */}
      <div className="h-8" />

      {/* Main content */}
      <div className="flex items-center justify-between mb-8">
        <div className="container py-8">
          {/* Header section with filters button */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold">Datasets</h1>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFiltersVisible(!isFiltersVisible)}
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
            <CreateDatasetButton />
          </div>

          {/* Dataset list */}
          <DatasetList 
            isFiltersVisible={isFiltersVisible} 
          />
        </div>
      </div>
    </div>
  )
} 