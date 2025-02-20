import { getDatasetById } from '@/lib/supabase'
import { DatasetDetails } from '@/components/DatasetDetails'
import { notFound } from 'next/navigation'

export default async function DatasetPage({
  params,
}: {
  params: { id: string }
}) {
  try {
    const dataset = await getDatasetById(params.id)
    
    if (!dataset) {
      notFound()
    }

    return <DatasetDetails dataset={dataset} />
  } catch (error) {
    console.error('Error loading dataset:', error)
    notFound()
  }
} 