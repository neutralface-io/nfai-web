'use client'

import { DatasetDetails } from '@/components/DatasetDetails'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { use } from 'react'

// Make the page a Server Component
export default function DatasetPage({
  params,
}: {
  params: { id: string }
}) {
  // Unwrap the params
  const { id } = use(params)

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Navigation zone */}
      <div className="mb-8">
        <Button
          variant="ghost"
          size="sm"
          href="/datasets"
          asChild
          className="text-muted-foreground"
        >
          <a>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Datasets
          </a>
        </Button>
      </div>

      {/* Content zone */}
      <DatasetDetails datasetId={id} />
    </div>
  )
} 