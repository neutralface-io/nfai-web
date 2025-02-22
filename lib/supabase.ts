import { createClient } from '@supabase/supabase-js'
import { Dataset } from '@/types/dataset'
import { Collection } from '@/types/collection'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

export async function getDatasets() {
  try {
    const { data, error } = await supabase
      .from('datasets')
      .select(`
        *,
        author:users!datasets_created_by_fkey (
          username,
          wallet_address
        ),
        collection_count:collection_items(count)
      `)
      .order('upload_date', { ascending: false })

    if (error) {
      console.error('Error fetching datasets:', error)
      throw error
    }

    return data?.map(dataset => ({
      ...dataset,
      collection_count: dataset.collection_count.length
    })) || []
  } catch (error) {
    console.error('Error in getDatasets:', error)
    return []
  }
}

export async function getDatasetById(id: string) {
  try {
    const { data, error } = await supabase
      .from('datasets')
      .select(`
        *,
        author:users!datasets_created_by_fkey (
          username,
          wallet_address
        ),
        collection_count:collection_items(count)
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching dataset:', error)
      throw error
    }

    if (!data) {
      throw new Error('Dataset not found')
    }

    // Transform the data to include the collection count
    return {
      ...data,
      collection_count: data.collection_count.length
    } as Dataset
  } catch (error) {
    console.error('Error in getDatasetById:', error)
    throw error
  }
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
  wallet_address: string
}

export async function createDataset(params: CreateDatasetParams) {
  try {
    console.log('Creating dataset with params:', params)

    // First, create user if they don't exist
    const { data: existingUser, error: userError } = await supabase
      .from('users')
      .upsert({
        wallet_address: params.wallet_address,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'wallet_address',
      })
      .select()
      .single()

    if (userError) {
      console.error('Error upserting user:', userError)
      throw userError
    }

    console.log('User created/found:', existingUser)

    // Now create the dataset
    const { data: dataset, error: datasetError } = await supabase
      .from('datasets')
      .insert({
        name: params.name,
        description: params.description,
        visibility: params.visibility,
        category_tags: params.category_tags,
        license: params.license,
        created_by: params.wallet_address,
        upload_date: new Date().toISOString(),
        size: 0,
        likes: 0,
      })
      .select()
      .single()

    if (datasetError) {
      console.error('Error creating dataset:', datasetError)
      throw datasetError
    }

    console.log('Dataset created:', dataset)
    return dataset
  } catch (error) {
    console.error('Create dataset error:', error)
    throw error
  }
}

export async function updateDataset(id: string, params: Partial<Dataset>) {
  try {
    // First check if user owns this dataset
    const { data: dataset, error: fetchError } = await supabase
      .from('datasets')
      .select('created_by')
      .eq('id', id)
      .single()

    if (fetchError) {
      throw fetchError
    }

    if (!dataset) {
      throw new Error('Dataset not found')
    }

    // Check if the provided wallet address matches the dataset creator
    if (dataset.created_by !== params.created_by) {
      throw new Error('Not authorized to update this dataset')
    }

    const { data, error } = await supabase
      .from('datasets')
      .update(params)
      .eq('id', id)
      .select(`
        *,
        author:users!datasets_created_by_fkey (
          username,
          wallet_address
        )
      `)
      .single()

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error('Update dataset error:', error)
    throw error
  }
}

export async function deleteDataset(id: string, walletAddress: string) {
  try {
    // First check if user owns this dataset
    const { data: dataset, error: fetchError } = await supabase
      .from('datasets')
      .select('created_by')
      .eq('id', id)
      .single()

    if (fetchError) {
      throw fetchError
    }

    // Check if the provided wallet address matches the dataset creator
    if (dataset.created_by !== walletAddress) {
      throw new Error('Not authorized to delete this dataset')
    }

    const { error } = await supabase
      .from('datasets')
      .delete()
      .eq('id', id)

    if (error) {
      throw error
    }
  } catch (error) {
    console.error('Delete dataset error:', error)
    throw error
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

interface UserProfile {
  wallet_address: string
  username?: string
  email?: string
}

export async function getUserProfile(walletAddress: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('wallet_address', walletAddress)
    .single()

  if (error) {
    throw error
  }

  return data
}

export async function updateUserProfile(profile: UserProfile) {
  try {
    // Validate username format if provided
    if (profile.username) {
      if (profile.username.length < 3) {
        throw new Error('Username must be at least 3 characters long')
      }
      if (!/^[a-zA-Z0-9_-]+$/.test(profile.username)) {
        throw new Error('Username can only contain letters, numbers, underscores, and hyphens')
      }

      // Check if username is already taken
      const { data: existingUser } = await supabase
        .from('users')
        .select('wallet_address')
        .eq('username', profile.username)
        .not('wallet_address', 'eq', profile.wallet_address)
        .maybeSingle()

      if (existingUser) {
        throw new Error('This username is already taken')
      }
    }

    // Check email uniqueness if provided
    if (profile.email) {
      const { data: existingEmail } = await supabase
        .from('users')
        .select('wallet_address')
        .eq('email', profile.email)
        .not('wallet_address', 'eq', profile.wallet_address)
        .maybeSingle()

      if (existingEmail) {
        throw new Error('This email is already registered')
      }
    }

    // If all checks pass, update the profile
    const { data, error } = await supabase
      .from('users')
      .upsert({
        wallet_address: profile.wallet_address,
        username: profile.username?.trim() || null,
        email: profile.email?.trim() || null,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'wallet_address',
      })
      .select()
      .single()

    if (error) {
      // Handle specific database errors
      if (error.code === '23505') { // Unique violation
        throw new Error('This username is already taken')
      }
      throw error
    }

    return data
  } catch (error) {
    console.error('Profile update error:', error)
    throw error
  }
}

export async function getLikedDatasets(walletAddress: string) {
  const { data } = await supabase
    .from('dataset_likes')
    .select('dataset_id')
    .eq('wallet_address', walletAddress)

  return new Set(data?.map(like => like.dataset_id) || [])
}

export async function toggleLike(datasetId: string, walletAddress: string) {
  try {
    console.log('Toggling like for dataset:', datasetId, 'wallet:', walletAddress)

    // First ensure the user exists
    const { error: userError } = await supabase
      .from('users')
      .upsert({
        wallet_address: walletAddress,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'wallet_address',
      })

    if (userError) {
      console.error('Error ensuring user exists:', userError)
      throw userError
    }

    // Now toggle the like
    const { data, error } = await supabase
      .rpc('toggle_like', {
        dataset_id: datasetId,
        wallet_address: walletAddress
      })

    if (error) {
      console.error('Error toggling like:', error)
      throw new Error(error.message || 'Failed to toggle like')
    }

    if (typeof data !== 'number') {
      throw new Error('Invalid response from toggle_like')
    }

    console.log('New like count:', data)
    return data
  } catch (error) {
    console.error('Toggle like error:', error)
    throw error
  }
}

// Get user's collections (created or shared with them)
export async function getUserCollections(walletAddress: string) {
  try {
    // First get collections created by the user
    const { data: ownedCollections, error: ownedError } = await supabase
      .from('collections')
      .select(`
        *,
        datasets:collection_items(
          dataset:datasets(*)
        )
      `)
      .eq('created_by', walletAddress)
      .order('created_at', { ascending: false })

    if (ownedError) throw ownedError

    // Then get collections shared with the user
    const { data: sharedCollections, error: sharedError } = await supabase
      .from('collection_shares')
      .select(`
        collection:collections (
          *,
          datasets:collection_items(
            dataset:datasets(*)
          )
        )
      `)
      .eq('shared_with', walletAddress)

    if (sharedError) throw sharedError

    // Combine and return both sets
    const shared = sharedCollections?.map(share => share.collection) || []
    return [...(ownedCollections || []), ...shared]

  } catch (error) {
    console.error('Error in getUserCollections:', error)
    return []
  }
}

// Create a new collection
export async function createCollection(collection: Partial<Collection>) {
  const { data, error } = await supabase
    .from('collections')
    .insert(collection)
    .select()
    .single()

  if (error) throw error
  return data
}

// Add dataset to collection
export async function addToCollection(collectionId: string, datasetId: string) {
  const { error } = await supabase
    .from('collection_items')
    .insert({ collection_id: collectionId, dataset_id: datasetId })

  if (error) throw error
}

// Remove dataset from collection
export async function removeFromCollection(collectionId: string, datasetId: string) {
  const { error } = await supabase
    .from('collection_items')
    .delete()
    .match({ collection_id: collectionId, dataset_id: datasetId })

  if (error) throw error
}

// Share collection with user
export async function shareCollection(collectionId: string, walletAddress: string) {
  const { error } = await supabase
    .from('collection_shares')
    .insert({ collection_id: collectionId, shared_with: walletAddress })

  if (error) throw error
}

// Delete a collection
export async function deleteCollection(collectionId: string) {
  try {
    // Delete collection (cascade will handle items and shares)
    const { error } = await supabase
      .from('collections')
      .delete()
      .eq('id', collectionId)

    if (error) throw error
  } catch (error) {
    console.error('Error deleting collection:', error)
    throw error
  }
}

// Get collection by ID
export async function getCollectionById(id: string) {
  try {
    const { data, error } = await supabase
      .from('collections')
      .select(`
        *,
        datasets:collection_items(
          dataset:datasets(
            *,
            author:users!datasets_created_by_fkey (
              username,
              wallet_address
            ),
            collection_count:collection_items(count)
          )
        )
      `)
      .eq('id', id)
      .single()

    if (error) throw error

    // Transform the data to include collection counts
    if (data && data.datasets) {
      data.datasets = data.datasets.map(item => ({
        ...item,
        dataset: {
          ...item.dataset,
          collection_count: item.dataset.collection_count.length
        }
      }))
    }

    return data
  } catch (error) {
    console.error('Error in getCollectionById:', error)
    throw error
  }
}

// Add this function to get collection count for a dataset
export async function getDatasetCollectionCount(datasetId: string) {
  const { count, error } = await supabase
    .from('collection_items')
    .select('*', { count: 'exact', head: true })
    .eq('dataset_id', datasetId)

  if (error) throw error
  return count || 0
}

// Update collection
export async function updateCollection(id: string, updates: Partial<Collection>) {
  const { data, error } = await supabase
    .from('collections')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
} 