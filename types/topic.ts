export interface Topic {
  id: number
  name: string
  usage_count: number
  created_at: string
}

// Make sure this is used in dataset.ts
export interface Dataset {
  id: string
  name: string
  description: string
  created_by: string
  author?: string
  upload_date: string
  size: number
  file_url?: string
  likes: number
  topics: Topic[]  // Array of Topic objects
  license: string
}

export interface CreateDatasetParams {
  name: string
  description: string
  visibility: string
  topic_ids: number[]  // Array of topic IDs
  license: string
  wallet_address: string
} 