'use client'

import { CollectionDetail } from '@/components/collections/CollectionDetail'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { use } from 'react'

export default function CollectionPage({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter()
  const { id } = use(params)

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
          Back to Collections
        </Button>
      </div>

      {/* Content zone */}
      <CollectionDetail collectionId={id} />
    </div>
  )
} 