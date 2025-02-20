import { DatasetList } from '@/components/DatasetList'

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Neutral Face</h1>
        <p className="text-gray-600">
          Discover and contribute to datasets for AI model training and RAG pipelines
        </p>
      </div>
      <DatasetList />
    </main>
  )
}
