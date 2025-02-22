'use client'

import { useState, useEffect } from 'react'
import { DatasetCard } from './DatasetCard'
import { DatasetFilters } from './DatasetFilters'
import { Dataset } from '@/types/dataset'
import { getDatasets } from '@/lib/supabase'
import { CreateDatasetModal } from './CreateDatasetModal'
import { Button } from './ui/button'
import { SlidersHorizontal } from 'lucide-react'

export function DatasetList() {
  const [datasets, setDatasets] = useState<Dataset[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    searchQuery: '',
    category: 'All',
    license: 'All'
  })
  const [appliedFilters, setAppliedFilters] = useState(filters)
  const [isFiltersVisible, setIsFiltersVisible] = useState(false)

  useEffect(() => {
    loadDatasets()
  }, [])

  async function loadDatasets() {
    try {
      const data = await getDatasets()
      setDatasets(data)
    } catch (error) {
      console.error('Error loading datasets:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApplyFilters = () => {
    setAppliedFilters(filters)
  }

  const handleResetFilters = () => {
    const defaultFilters = {
      searchQuery: '',
      category: 'All',
      license: 'All'
    }
    setFilters(defaultFilters)
    setAppliedFilters(defaultFilters)
  }

  const filteredDatasets = datasets.filter(dataset => {
    const matchesSearch = appliedFilters.searchQuery.trim() === '' || 
      dataset.name.toLowerCase().includes(appliedFilters.searchQuery.toLowerCase()) ||
      dataset.description.toLowerCase().includes(appliedFilters.searchQuery.toLowerCase())

    const matchesCategory = appliedFilters.category === 'All' || 
      dataset.category_tags.includes(appliedFilters.category.toLowerCase())

    const matchesLicense = appliedFilters.license === 'All' || 
      dataset.license === appliedFilters.license

    return matchesSearch && matchesCategory && matchesLicense
  })

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Available Datasets</h1>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-900"
            onClick={() => setIsFiltersVisible(!isFiltersVisible)}
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            {isFiltersVisible ? 'Hide filters' : 'Show filters'}
          </Button>
        </div>
        <CreateDatasetModal />
      </div>

      <DatasetFilters
        filters={filters}
        onFiltersChange={setFilters}
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
        isVisible={isFiltersVisible}
      />

      {loading ? (
        <div className="text-center py-8">Loading datasets...</div>
      ) : filteredDatasets.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No datasets found matching your criteria
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDatasets.map((dataset) => (
            <DatasetCard key={dataset.id} dataset={dataset} />
          ))}
        </div>
      )}
    </div>
  )
} 