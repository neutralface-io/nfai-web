export interface Dataset {
  id: string
  name: string
  description: string
  created_by: string
  author?: {
    username: string
    wallet_address: string
  }
  upload_date: string
  size: number
  file_url?: string
  likes: number
  visibility: string
  license: string
  collection_count: number
  topics: string[]
}

export interface CreateDatasetParams {
  name: string
  description: string
  visibility: string
  license: string
  wallet_address: string
  topics: string[]
} 