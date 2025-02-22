'use client'

import { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { Collection } from '@/types/collection'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { Share2, Trash2 } from 'lucide-react'
import { ShareCollectionDialog } from './ShareCollectionDialog'
import { deleteCollection } from '@/lib/supabase'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import Link from 'next/link'

interface CollectionCardProps {
  collection: Collection
  onUpdate: () => void
}

export function CollectionCard({ collection, onUpdate }: CollectionCardProps) {
  const { publicKey } = useWallet()
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const isOwner = publicKey?.toString() === collection.created_by

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await deleteCollection(collection.id)
      toast.success('Collection deleted')
      onUpdate()
    } catch (error) {
      console.error('Error deleting collection:', error)
      toast.error('Failed to delete collection')
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{collection.name}</CardTitle>
              <CardDescription>{collection.description}</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => setShowShareDialog(true)}>
                <Share2 className="h-4 w-4" />
              </Button>
              {isOwner && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-500">
            {collection.datasets?.length || 0} datasets
          </div>
          <Link href={`/collections/${collection.id}`}>
            <Button variant="link" className="px-0">
              View Collection
            </Button>
          </Link>
        </CardContent>
      </Card>

      <ShareCollectionDialog
        collection={collection}
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
      />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Collection</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this collection? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
} 