'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { Badge } from './ui/badge'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet'
import { cn } from '@/lib/utils'

export const CATEGORIES = [
  'All',
  'Text',
  'Image',
  'Audio',
  'Video',
  'Tabular',
  'Time Series',
  'Graph',
  'Other'
]

export const LICENSES = [
  'All',
  'MIT',
  'Apache 2.0',
  'GPL',
  'Creative Commons',
  'Public Domain'
]

interface DatasetFiltersProps {
  filters: {
    searchQuery: string
    category: string
    license: string
  }
  onFiltersChange: (filters: any) => void
  onApplyFilters: () => void
  onResetFilters: () => void
  isVisible: boolean
}

export function DatasetFilters({ 
  filters, 
  onFiltersChange, 
  onApplyFilters, 
  onResetFilters,
  isVisible 
}: DatasetFiltersProps) {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)
  
  const activeFilterCount = [
    filters.category !== 'All' ? 1 : 0,
    filters.license !== 'All' ? 1 : 0,
  ].reduce((a, b) => a + b, 0)

  const FilterControls = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-700">Category</div>
          <Select
            value={filters.category}
            onValueChange={(value) => onFiltersChange({ ...filters, category: value })}
          >
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-700">License</div>
          <Select
            value={filters.license}
            onValueChange={(value) => onFiltersChange({ ...filters, license: value })}
          >
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Select license" />
            </SelectTrigger>
            <SelectContent>
              {LICENSES.map(license => (
                <SelectItem key={license} value={license}>{license}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {activeFilterCount > 0 && (
        <div className="flex justify-end gap-2 pt-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onResetFilters}
          >
            Clear all
          </Button>
          <Button 
            size="sm"
            onClick={() => {
              onApplyFilters()
              setIsMobileFiltersOpen(false)
            }}
          >
            Show results
          </Button>
        </div>
      )}
    </div>
  )

  return (
    <div className={cn(
      "space-y-4 transition-all duration-300 ease-in-out",
      isVisible ? "opacity-100 max-h-[1000px]" : "opacity-0 max-h-0 overflow-hidden"
    )}>
      <div className="rounded-lg border border-gray-100 bg-gray-50/50 backdrop-blur-sm">
        <div className="p-4 md:p-6">
          <FilterControls />
        </div>
        {/* Active Filters section... */}
      </div>
    </div>
  )
} 