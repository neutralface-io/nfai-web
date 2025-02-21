import { Calendar, Heart, HardDrive, Tag } from 'lucide-react'
import { Button } from './ui/button'
import Link from 'next/link'
import { Dataset } from '../types/dataset'
import { getDisplayName } from '@/lib/utils'

interface DatasetCardProps {
  dataset: Dataset
}

export function DatasetCard({ dataset }: DatasetCardProps) {
  if (!dataset) {
    return null // Or return a placeholder/skeleton
  }

  return (
    <div className="border rounded-lg p-4 space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium">{dataset.name || 'Untitled Dataset'}</h3>
          <p className="text-sm text-muted-foreground">
            {dataset.description || 'No description available'}
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          {getDisplayName(dataset.author)}
        </div>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-gray-500">
          <Calendar className="w-4 h-4 mr-2" />
          <span className="text-sm">{new Date(dataset.upload_date).toLocaleDateString()}</span>
        </div>
        
        <div className="flex items-center text-gray-500">
          <HardDrive className="w-4 h-4 mr-2" />
          <span className="text-sm">{dataset.size} MB</span>
        </div>
        
        <div className="flex items-center text-gray-500">
          <Tag className="w-4 h-4 mr-2" />
          <div className="flex gap-2">
            {dataset.category_tags.map((tag) => (
              <span
                key={tag}
                className="text-sm bg-gray-100 px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <Button variant="outline" size="sm">
          <Heart className="w-4 h-4 mr-2" />
          {dataset.likes}
        </Button>
        <Link href={`/datasets/${dataset.id}`}>
          <Button size="sm">View Details</Button>
        </Link>
      </div>
    </div>
  )
} 