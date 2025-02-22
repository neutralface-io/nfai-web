'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from './ui/input'
import { Search, Loader2 } from 'lucide-react'
import { Dataset } from '@/types/dataset'
import { getDatasets } from '@/lib/supabase'

export function SearchBar() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [datasets, setDatasets] = useState<Dataset[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  // Load datasets
  useEffect(() => {
    const loadDatasets = async () => {
      try {
        setIsLoading(true)
        const data = await getDatasets()
        setDatasets(data || [])
      } catch (error) {
        console.error('Error loading datasets:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadDatasets()
  }, [])

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Simple search function
  const searchResults = query.trim() === '' ? [] : datasets
    .filter(dataset => 
      dataset.name?.toLowerCase().includes(query.toLowerCase()) ||
      dataset.description?.toLowerCase().includes(query.toLowerCase())
    )
    .slice(0, 5)

  return (
    <div className="relative w-full max-w-sm" ref={containerRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
        <Input
          placeholder="Search datasets..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          className="pl-10 bg-white"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4 animate-spin" />
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute top-full w-full mt-2 py-2 bg-white border rounded-lg shadow-lg z-50">
          {searchResults.length === 0 ? (
            <div className="px-4 py-2 text-sm text-gray-500">
              {query.trim() === '' ? 'Start typing to search...' : 'No results found'}
            </div>
          ) : (
            searchResults.map(dataset => (
              <button
                key={dataset.id}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                onClick={() => {
                  router.push(`/datasets/${dataset.id}`)
                  setIsOpen(false)
                  setQuery('')
                }}
              >
                <div className="font-medium">{dataset.name || 'Untitled'}</div>
                {dataset.description && (
                  <div className="text-sm text-gray-500 truncate">
                    {dataset.description}
                  </div>
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
} 