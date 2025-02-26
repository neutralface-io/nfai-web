"use client"

import { useState, useRef, useEffect } from 'react'
import { X, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface TopicInputProps {
  selectedTopics: string[]
  onTopicAdd: (topic: string) => void
  onTopicRemove: (topic: string) => void
  existingTopics?: string[]
  placeholder?: string
  className?: string
}

export function TopicInput({
  selectedTopics,
  onTopicAdd,
  onTopicRemove,
  existingTopics = [],
  placeholder = 'Add topics...',
  className
}: TopicInputProps) {
  const [input, setInput] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Filter suggestions based on input and already selected topics
  const suggestions = existingTopics
    .filter(topic => 
      topic.toLowerCase().includes(input.toLowerCase()) && 
      !selectedTopics.includes(topic)
    )
    .slice(0, 5)

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault()
      const newTopic = input.trim().toLowerCase()
      if (!selectedTopics.includes(newTopic)) {
        onTopicAdd(newTopic)
      }
      setInput('')
    }
  }

  const handleSuggestionClick = (topic: string) => {
    onTopicAdd(topic)
    setInput('')
    setShowSuggestions(false)
    inputRef.current?.focus()
  }

  // Close suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(e.target as Node) &&
        !inputRef.current?.contains(e.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex flex-wrap gap-2">
        {selectedTopics.map(topic => (
          <Badge
            key={topic}
            variant="secondary"
            className="flex items-center gap-1"
          >
            {topic}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-4 w-4 p-0 hover:bg-transparent"
              onClick={() => onTopicRemove(topic)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
      </div>

      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleInputKeyDown}
          onFocus={() => setShowSuggestions(true)}
          placeholder={placeholder}
        />

        {/* Suggestions dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-md"
          >
            <ScrollArea className="max-h-[200px]">
              {suggestions.map(topic => (
                <Button
                  key={topic}
                  variant="ghost"
                  className="w-full px-4 py-2 justify-start font-normal"
                  onClick={() => handleSuggestionClick(topic)}
                >
                  <Plus className="h-3 w-3 mr-2" />
                  {topic}
                </Button>
              ))}
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  )
} 