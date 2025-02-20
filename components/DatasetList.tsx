'use client'

import { useState, useEffect } from 'react'
import { DatasetCard } from './DatasetCard'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getDatasets } from '@/lib/supabase'
import { Dataset } from '@/types/dataset'
import { CreateDatasetModal } from './CreateDatasetModal'

type SortOption = 'popular' | 'recent' | 'size' | 'category'

export function DatasetList() {
  const [sortBy, setSortBy] = useState<SortOption>('recent')
  const [datasets, setDatasets] = useState<Dataset[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadDatasets() {
      try {
        setIsLoading(true)
        const data = await getDatasets()
        
        // Sort the datasets based on selected option
        const sortedData = sortDatasets(data, sortBy)
        setDatasets(sortedData)
        setError(null)
      } catch (err) {
        setError('Failed to load datasets')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    loadDatasets()
  }, [sortBy])

  function sortDatasets(data: Dataset[], sort: SortOption): Dataset[] {
    switch (sort) {
      case 'popular':
        return [...data].sort((a, b) => b.likes - a.likes)
      case 'recent':
        return [...data].sort((a, b) => 
          new Date(b.upload_date).getTime() - new Date(a.upload_date).getTime()
        )
      case 'size':
        return [...data].sort((a, b) => b.size - a.size)
      case 'category':
        return [...data].sort((a, b) => 
          a.category_tags[0]?.localeCompare(b.category_tags[0] || '') || 0
        )
      default:
        return data
    }
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading datasets...</div>
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        {error}
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Available Datasets</h2>
        <div className="flex gap-4">
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="recent">Recently Added</SelectItem>
              <SelectItem value="size">Size</SelectItem>
              <SelectItem value="category">Category</SelectItem>
            </SelectContent>
          </Select>
          <CreateDatasetModal />
        </div>
      </div>

      {datasets.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No datasets found
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {datasets.map((dataset) => (
            <DatasetCard
              key={dataset.id}
              id={dataset.id}
              name={dataset.name}
              description={dataset.description}
              uploadDate={dataset.upload_date}
              size={dataset.size}
              categoryTags={dataset.category_tags}
              likes={dataset.likes}
            />
          ))}
        </div>
      )}
    </div>
  )
} 