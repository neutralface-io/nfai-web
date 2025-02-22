'use client'

import { useState } from 'react'
import { Check, X } from 'lucide-react'
import { Button } from './ui/button'

interface InlineEditProps {
  value: string
  onSave: (value: string) => Promise<void>
  isOwner?: boolean
  textClassName?: string
  inputClassName?: string
  isMultiline?: boolean
}

export function InlineEdit({
  value,
  onSave,
  isOwner = false,
  textClassName = '',
  inputClassName = '',
  isMultiline = false
}: InlineEditProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [pendingValue, setPendingValue] = useState(value)

  const handleSave = async () => {
    try {
      await onSave(pendingValue)
      setIsEditing(false)
    } catch (error) {
      // Error handling is done in the parent component
      setPendingValue(value) // Reset to original value
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setPendingValue(value)
  }

  if (!isEditing) {
    return (
      <div
        className={`${isOwner ? 'cursor-pointer hover:text-primary' : ''} ${textClassName}`}
        onClick={() => isOwner && setIsEditing(true)}
      >
        {value || 'No description'}
      </div>
    )
  }

  return (
    <div className="flex items-start gap-2">
      {isMultiline ? (
        <textarea
          value={pendingValue}
          onChange={(e) => setPendingValue(e.target.value)}
          className={`bg-transparent border-b border-primary outline-none w-full resize-none ${inputClassName}`}
          rows={3}
          autoFocus
        />
      ) : (
        <input
          type="text"
          value={pendingValue}
          onChange={(e) => setPendingValue(e.target.value)}
          className={`bg-transparent border-b border-primary outline-none w-full ${inputClassName}`}
          autoFocus
        />
      )}
      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSave}
          className="h-8 w-8 p-0"
        >
          <Check className="h-4 w-4 text-green-500" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCancel}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4 text-red-500" />
        </Button>
      </div>
    </div>
  )
} 