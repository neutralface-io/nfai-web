'use client'

import { ArrowLeft } from 'lucide-react'
import { Button } from './button'
import { useRouter } from 'next/navigation'

interface PageHeaderProps {
  title: string
  description?: string
  showBack?: boolean
  children?: React.ReactNode
}

export function PageHeader({ title, description, showBack, children }: PageHeaderProps) {
  const router = useRouter()

  return (
    <div className="space-y-4">
      {showBack && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="mb-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      )}
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">
              {description}
            </p>
          )}
        </div>
        {children}
      </div>
    </div>
  )
} 