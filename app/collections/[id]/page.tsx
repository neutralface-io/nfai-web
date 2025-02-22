import { getCollectionById } from '@/lib/supabase'
import { CollectionDetail } from '@/components/collections/CollectionDetail'

interface CollectionPageProps {
  params: {
    id: string
  }
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  return <CollectionDetail collectionId={params.id} />
} 