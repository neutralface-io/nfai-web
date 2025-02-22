export interface Collection {
  id: string
  name: string
  description?: string
  created_by: string
  created_at: string
  is_public: boolean
  datasets?: Dataset[]
  shared_with?: string[]
} 