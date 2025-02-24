'use client'

import { DatasetDetails } from '@/components/DatasetDetails'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { use, useEffect, useState } from 'react'

// Make the page a Server Component
export default function DatasetPage({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter()
  // Unwrap the params
  const { id } = use(params)
  const [backText, setBackText] = useState('Back')

  useEffect(() => {
    // Get the previous page URL
    const referrer = document.referrer
    
    if (referrer) {
      if (referrer.includes('/collections')) {
        setBackText('Back to Collections')
      } else if (referrer.includes('/datasets')) {
        setBackText('Back to Datasets')
      } else if (referrer.includes('/search')) {
        setBackText('Back to Search Results')
      }
    }
  }, [])

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Navigation zone */}
      <div className="mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="text-muted-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {backText}
        </Button>
      </div>

      {/* Content zone */}
      <DatasetDetails datasetId={id} />
    </div>
  )
} 