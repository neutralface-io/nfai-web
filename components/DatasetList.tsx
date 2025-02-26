'use client'

import { useState, useEffect } from 'react'
import { DatasetCard } from './DatasetCard'
import { DatasetFilters } from './DatasetFilters'
import { Dataset } from '@/types/dataset'
import { getDatasets, getAllTopics } from '@/lib/supabase'
import { CreateDatasetModal } from './CreateDatasetModal'
import { Button } from './ui/button'
import { SlidersHorizontal } from 'lucide-react'

interface DatasetListProps {
  isFiltersVisible: boolean
}

export function DatasetList({ isFiltersVisible }: DatasetListProps) {
  const [datasets, setDatasets] = useState<Dataset[]>([])
  const [topics, setTopics] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    topic: 'All',
    license: 'All'
  })

  useEffect(() => {
    loadDatasets()
    loadTopics()
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

  async function loadTopics() {
    try {
      const topicsList = await getAllTopics()
      setTopics(topicsList)
    } catch (error) {
      console.error('Error loading topics:', error)
    }
  }

  const filteredDatasets = datasets.filter(dataset => {
    const matchesLicense = filters.license === 'All' || 
      dataset.license === filters.license

    const matchesTopic = filters.topic === 'All' || 
      (dataset.topics && dataset.topics.includes(filters.topic))

    return matchesLicense && matchesTopic
  })

  return (
    <div className="space-y-6">
      <DatasetFilters
        filters={filters}
        topics={topics}
        onFiltersChange={setFilters}
        onResetFilters={() => setFilters({ topic: 'All', license: 'All' })}
        isVisible={isFiltersVisible}
      />

      {/* Content zone */}
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