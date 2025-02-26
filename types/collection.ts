export interface Collection {
  id: string
  name: string
  description?: string
  created_by: string
  created_at: string
  is_public: boolean
  datasets?: {
    dataset: {
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
    }
  }[]
}

export interface CreateCollectionParams {
  name: string
  description: string
  is_public: boolean
  created_by: string
} 