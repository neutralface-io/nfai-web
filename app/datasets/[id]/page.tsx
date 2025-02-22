'use client'

import { useEffect, useState, use } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { Dataset } from '@/types/dataset'
import { getDatasetById, updateDataset, deleteDataset } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Calendar, HardDrive, Tag, Trash2, Globe, FileText, Folders } from 'lucide-react'
import { InlineEdit } from '@/components/ui/inline-edit'
import { toast } from 'sonner'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { getDisplayName } from '@/lib/utils'

interface PageProps {
  params: Promise<{ id: string }>
}

export default function DatasetPage({ params }: PageProps) {
  const { id } = use(params) // Unwrap the Promise
  const { publicKey } = useWallet()
  const [dataset, setDataset] = useState<Dataset | null>(null)
  const [loading, setLoading] = useState(true)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const router = useRouter()

  const isOwner = publicKey?.toBase58() === dataset?.created_by

  useEffect(() => {
    loadDataset()
  }, [id]) // Now using unwrapped id

  async function loadDataset() {
    try {
      setLoading(true)
      const data = await getDatasetById(id)
      setDataset(data)
    } catch (error) {
      console.error('Error loading dataset:', error)
      toast.error('Failed to load dataset')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateField = async (field: keyof Dataset, value: string) => {
    if (!dataset || !publicKey) return

    try {
      const updatedDataset = await updateDataset(dataset.id, {
        [field]: value,
        created_by: publicKey.toBase58()
      })
      setDataset(updatedDataset)
      toast.success('Dataset updated')
    } catch (error) {
      console.error('Error updating dataset:', error)
      toast.error('Failed to update dataset')
      throw error // Propagate error to InlineEdit component
    }
  }

  const handleDelete = async () => {
    if (!dataset || !publicKey) return

    try {
      await deleteDataset(dataset.id, publicKey.toBase58())
      toast.success('Dataset deleted')
      router.push('/')
    } catch (error) {
      console.error('Error deleting dataset:', error)
      toast.error('Failed to delete dataset')
    }
  }

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }

  if (!dataset) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-8 text-gray-500">
          Dataset not found
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Datasets
            </Button>
          </Link>
          {isOwner && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Dataset
            </Button>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1 flex-1">
              <InlineEdit
                value={dataset.name}
                onSave={(value) => handleUpdateField('name', value)}
                isOwner={isOwner}
                textClassName="text-3xl font-bold tracking-tight"
              />
              <div className="flex items-center gap-2 text-muted-foreground">
                <Avatar className="h-6 w-6">
                  <AvatarFallback>{getDisplayName(dataset.author)[0]}</AvatarFallback>
                </Avatar>
                <span>{getDisplayName(dataset.author)}</span>
                <span>•</span>
                <Calendar className="h-4 w-4" />
                <span>{new Date(dataset.upload_date).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <InlineEdit
            value={dataset.description}
            onSave={(value) => handleUpdateField('description', value)}
            isOwner={isOwner}
            textClassName="text-lg text-muted-foreground"
            isMultiline
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tags Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Categories & Tags
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {dataset.category_tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Dataset Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Dataset Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium mb-1">Size</div>
                  <div className="flex items-center text-muted-foreground">
                    <HardDrive className="h-4 w-4 mr-2" />
                    {dataset.size} MB
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium mb-1">Visibility</div>
                  <div className="flex items-center text-muted-foreground">
                    <Globe className="h-4 w-4 mr-2" />
                    {dataset.visibility}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium mb-1">License</div>
                  <div className="flex items-center text-muted-foreground">
                    <FileText className="h-4 w-4 mr-2" />
                    {dataset.license}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium mb-1">Collections</div>
                  <div className="flex items-center text-muted-foreground">
                    <Folders className="h-4 w-4 mr-2" />
                    {dataset.collection_count} collections
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Usage Instructions or Additional Info can go here */}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Download Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Download</CardTitle>
            </CardHeader>
            <CardContent>
              {dataset.file_url ? (
                <Button className="w-full" asChild>
                  <a href={dataset.file_url} target="_blank" rel="noopener noreferrer">
                    Download Dataset
                  </a>
                </Button>
              ) : (
                <div className="text-muted-foreground text-sm">
                  No file available for download
                </div>
              )}
            </CardContent>
          </Card>

          {/* Stats Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">{dataset.likes}</div>
                  <div className="text-sm text-muted-foreground">Likes</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{dataset.collection_count}</div>
                  <div className="text-sm text-muted-foreground">Collections</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              dataset and remove it from any collections it belongs to.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
            >
              Delete Dataset
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 