"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export interface ComboboxProps {
  value?: string
  onSelect: (value: string) => void
  options: string[]  // Ensure this is always an array
  placeholder?: string
  emptyText?: string
}

export function Combobox({
  value,
  onSelect,
  options = [], // Add default empty array
  placeholder = "Select...",
  emptyText = "No results found."
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState("")

  // Ensure options is always an array
  const safeOptions = Array.isArray(options) ? options : []

  const filteredOptions = React.useMemo(() => {
    const search = inputValue.toLowerCase()
    return safeOptions.filter(option => 
      option.toLowerCase().includes(search)
    )
  }, [safeOptions, inputValue])

  const handleInputChange = (value: string) => {
    setInputValue(value)
  }

  const handleSelect = React.useCallback((selectedValue: string) => {
    if (!selectedValue) return
    onSelect(selectedValue)
    setOpen(false)
    setInputValue("")
  }, [onSelect])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput 
            placeholder="Search or enter a new topic..." 
            value={inputValue}
            onValueChange={handleInputChange}
          />
          <CommandEmpty>
            {inputValue ? (
              <CommandItem
                value={inputValue}
                onSelect={() => handleSelect(inputValue)}
              >
                Add "{inputValue}"
              </CommandItem>
            ) : (
              emptyText
            )}
          </CommandEmpty>
          <CommandGroup>
            {filteredOptions.map((option) => (
              <CommandItem
                key={option}
                value={option}
                onSelect={() => handleSelect(option)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === option ? "opacity-100" : "opacity-0"
                  )}
                />
                {option}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
} 