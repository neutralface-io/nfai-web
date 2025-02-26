'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { cn } from '@/lib/utils'

export const LICENSES = [
  'All',
  'MIT',
  'Apache-2.0',
  'GPL-3.0',
  'BSD-3-Clause',
  'CC BY 4.0',
  'Public Domain'
]

interface DatasetFiltersProps {
  filters: {
    license: string
    topic: string
  }
  topics: string[]
  onFiltersChange: (filters: any) => void
  onResetFilters: () => void
  isVisible: boolean
}

export function DatasetFilters({ 
  filters, 
  topics, 
  onFiltersChange, 
  onResetFilters, 
  isVisible 
}: DatasetFiltersProps) {
  const activeFilterCount = [
    filters.license !== 'All' ? 1 : 0,
    filters.topic !== 'All' ? 1 : 0,
  ].reduce((a, b) => a + b, 0)

  return (
    <div className={cn(
      "space-y-4 transition-all duration-300 ease-in-out",
      isVisible ? "opacity-100 max-h-[1000px]" : "opacity-0 max-h-0 overflow-hidden"
    )}>
      <div className="rounded-lg border bg-card p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Topic filter */}
          <div className="space-y-2">
            <div className="text-sm font-medium">Topic</div>
            <Select
              value={filters.topic}
              onValueChange={(value) => onFiltersChange({ ...filters, topic: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select topic" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Topics</SelectItem>
                {topics.map(topic => (
                  <SelectItem key={topic} value={topic}>{topic}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* License filter */}
          <div className="space-y-2">
            <div className="text-sm font-medium">License</div>
            <Select
              value={filters.license}
              onValueChange={(value) => onFiltersChange({ ...filters, license: value })}
            >
              <SelectTrigger>
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
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={onResetFilters}
            >
              Reset filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
} 