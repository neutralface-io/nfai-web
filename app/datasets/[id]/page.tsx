import { getDatasetById } from '@/lib/supabase'
import { DatasetDetails } from '@/components/DatasetDetails'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function DatasetPage({
  params,
}: PageProps) {
  try {
    // Await the params
    const { id } = await params
    const dataset = await getDatasetById(id)
    
    if (!dataset) {
      notFound()
    }

    return <DatasetDetails dataset={dataset} />
  } catch (error) {
    console.error('Error loading dataset:', error)
    notFound()
  }
} 