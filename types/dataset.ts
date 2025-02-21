export interface Dataset {
  id: string
  name: string
  description: string
  upload_date: string
  size: number
  category_tags: string[]
  likes: number
  file_url: string | null
  visibility: string
  license: string
  created_by: string
  author?: {
    username: string | null
    wallet_address: string
  }
}

export interface CreateDatasetParams {
  name: string
  description: string
  visibility: string
  category_tags: string[]
  license: string
  wallet_address: string
} 