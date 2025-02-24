'use client'

import { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { Collection } from '@/types/collection'
import { Button } from '../ui/button'
import { Trash2, Folders } from 'lucide-react'
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
import { useRouter } from 'next/navigation'

interface CollectionCardProps {
  collection: Collection
  onUpdate: () => void
}

export function CollectionCard({ collection, onUpdate }: CollectionCardProps) {
  const { publicKey } = useWallet()
  const router = useRouter()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const isOwner = publicKey?.toString() === collection.created_by

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) {
      return
    }
    router.push(`/collections/${collection.id}`)
  }

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
      <div 
        onClick={handleCardClick}
        className="group bg-card border rounded-lg shadow-sm hover:shadow transition-all cursor-pointer flex flex-col h-full"
      >
        <div className="p-6 flex-1">
          <div className="flex justify-between items-start gap-4 mb-4">
            <div className="flex-1">
              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                {collection.name}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {collection.description || 'No description'}
              </p>
            </div>
          </div>

          <div className="flex items-center text-sm text-muted-foreground">
            <Folders className="h-4 w-4 mr-2" />
            <span>{collection.datasets?.length || 0} datasets</span>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t">
          <div className="h-14 px-6 flex items-center justify-end">
            {isOwner && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowDeleteDialog(true)}
                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

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