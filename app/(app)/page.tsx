import { DatasetList } from '@/components/DatasetList'

export default function HomePage() {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Home</h1>
      </div>
      
      <DatasetList isFiltersVisible={true} />
    </div>
  )
} 