import { createClient } from '@supabase/supabase-js'
import { Dataset } from '@/types/dataset'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

export async function getDatasets() {
  const { data, error } = await supabase
    .from('datasets')
    .select('*')
    .order('upload_date', { ascending: false })

  if (error) {
    throw error
  }

  return data as Dataset[]
}

export async function getDatasetById(id: string) {
  const { data, error } = await supabase
    .from('datasets')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    throw error
  }

  return data as Dataset
}

export async function likeDataset(id: string) {
  const { error } = await supabase.rpc('increment_likes', { dataset_id: id })

  if (error) {
    throw error
  }
}

interface CreateDatasetParams {
  name: string
  description: string
  visibility: string
  category_tags: string[]
  license: string
}

export async function createDataset(params: CreateDatasetParams) {
  try {
    console.log('Creating dataset with params:', params)

    // First, check if we can connect to Supabase
    const { data: testConnection, error: connectionError } = await supabase
      .from('datasets')
      .select('count')
      .limit(1)

    if (connectionError) {
      console.error('Connection test failed:', connectionError)
      throw new Error(`Connection error: ${connectionError.message}`)
    }

    console.log('Connection test successful')

    // Now try to insert
    const { data, error } = await supabase
      .from('datasets')
      .insert({
        name: params.name,
        description: params.description,
        visibility: params.visibility,
        category_tags: params.category_tags,
        license: params.license,
        size: 0, // Default size
        likes: 0, // Default likes
        file_url: null, // No file initially
      })
      .select()
      .single()

    if (error) {
      // Log all possible error properties
      console.error('Supabase insertion error:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
        full_error: JSON.stringify(error, null, 2)
      })

      // Throw a more descriptive error
      throw new Error(`Failed to create dataset: ${error.message}`)
    }

    if (!data) {
      console.error('No data returned from insert')
      throw new Error('No data returned from database after insert')
    }

    console.log('Dataset created successfully:', data)
    return data
  } catch (error) {
    // Catch and log any other errors
    console.error('Unexpected error in createDataset:', {
      error,
      stringified: JSON.stringify(error, null, 2),
      type: typeof error,
      isError: error instanceof Error,
      message: error instanceof Error ? error.message : 'Unknown error'
    })

    // Always throw an Error object with a message
    if (error instanceof Error) {
      throw error
    } else {
      throw new Error('An unexpected error occurred while creating the dataset')
    }
  }
}

export async function uploadDatasetFile(datasetId: string, file: File) {
  try {
    const fileExt = file.name.split('.').pop()
    const filePath = `${datasetId}/${crypto.randomUUID()}.${fileExt}`
    
    const { error: uploadError } = await supabase
      .storage
      .from('datasets')
      .upload(filePath, file)

    if (uploadError) {
      throw uploadError
    }

    const { data: fileUrl } = supabase
      .storage
      .from('datasets')
      .getPublicUrl(filePath)

    if (!fileUrl) {
      throw new Error('Failed to get file URL')
    }

    // Update the dataset with file information
    const { error: updateError } = await supabase
      .from('datasets')
      .update({
        file_url: fileUrl.publicUrl,
        size: Math.round(file.size / 1024 / 1024), // Convert bytes to MB
      })
      .eq('id', datasetId)

    if (updateError) {
      // Clean up the uploaded file if the update fails
      await supabase.storage.from('datasets').remove([filePath])
      throw updateError
    }

    return fileUrl.publicUrl
  } catch (error) {
    console.error('Upload dataset file error:', error)
    throw error
  }
} 