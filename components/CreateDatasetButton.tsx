'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { Plus } from 'lucide-react'
import { CreateDatasetModal } from './CreateDatasetModal'

export function CreateDatasetButton() {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <Button onClick={() => setShowModal(true)}>
        <Plus className="w-4 h-4 mr-2" />
        Create Dataset
      </Button>

      <CreateDatasetModal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={() => {
          setShowModal(false)
          window.location.reload()
        }}
      />
    </>
  )
} 