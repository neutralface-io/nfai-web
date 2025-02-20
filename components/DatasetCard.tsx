import { Calendar, Heart, HardDrive, Tag } from 'lucide-react'
import { Button } from './ui/button'
import Link from 'next/link'

interface DatasetCardProps {
  id?: string
  name?: string
  description?: string
  uploadDate?: string
  size?: number
  categoryTags?: string[]
  likes?: number
}

export function DatasetCard({
  id = '1',
  name = 'Sample Dataset',
  description = 'This is a sample dataset description',
  uploadDate = '2024-03-20',
  size = 100,
  categoryTags = ['AI', 'Machine Learning'],
  likes = 0
}: DatasetCardProps) {
  return (
    <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-semibold mb-2">{name}</h3>
      <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-gray-500">
          <Calendar className="w-4 h-4 mr-2" />
          <span className="text-sm">{new Date(uploadDate).toLocaleDateString()}</span>
        </div>
        
        <div className="flex items-center text-gray-500">
          <HardDrive className="w-4 h-4 mr-2" />
          <span className="text-sm">{size} MB</span>
        </div>
        
        <div className="flex items-center text-gray-500">
          <Tag className="w-4 h-4 mr-2" />
          <div className="flex gap-2">
            {categoryTags.map((tag) => (
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
          {likes}
        </Button>
        <Link href={`/datasets/${id}`}>
          <Button size="sm">View Details</Button>
        </Link>
      </div>
    </div>
  )
} 