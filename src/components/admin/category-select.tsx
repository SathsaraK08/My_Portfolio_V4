/**
 * Category Select Component
 *
 * A reusable dropdown component for selecting service categories
 * with predefined options and custom value support.
 *
 * @author Portfolio Admin System
 * @version 1.0.0
 */

'use client'

import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Plus, X } from 'lucide-react'

// Predefined category options for services
const CATEGORY_OPTIONS = [
  'Web Development',
  'Mobile Development',
  'Backend Development',
  'Frontend Development',
  'Full Stack Development',
  'DevOps & Cloud',
  'UI/UX Design',
  'API Development',
  'Database Design',
  'E-commerce Solutions',
  'CMS Development',
  'AI & Machine Learning',
  'Consulting Services',
  'Maintenance & Support'
] as const

interface CategorySelectProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  required?: boolean
}

/**
 * CategorySelect Component
 *
 * Provides a dropdown with predefined categories and option to add custom ones
 */
export function CategorySelect({
  value,
  onChange,
  placeholder = "Select or enter a category",
  className = "",
  required = false
}: CategorySelectProps) {
  const [isCustom, setIsCustom] = useState(false)
  const [customValue, setCustomValue] = useState('')

  // Check if current value is in predefined options
  const isValueInOptions = CATEGORY_OPTIONS.includes(value as any)

  const handleSelectChange = (selectedValue: string) => {
    if (selectedValue === 'custom') {
      setIsCustom(true)
      setCustomValue(value)
    } else {
      setIsCustom(false)
      onChange(selectedValue)
    }
  }

  const handleCustomValueChange = (newValue: string) => {
    setCustomValue(newValue)
    onChange(newValue)
  }

  const handleCancelCustom = () => {
    setIsCustom(false)
    setCustomValue('')
    onChange('')
  }

  const handleSaveCustom = () => {
    setIsCustom(false)
    onChange(customValue)
  }

  // If current value is not in options and not empty, show custom input
  if (!isValueInOptions && value && !isCustom) {
    return (
      <div className={className}>
        <div className="flex gap-2">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setIsCustom(true)
              setCustomValue(value)
            }}
            title="Switch to dropdown"
          >
            Switch to Dropdown
          </Button>
        </div>
      </div>
    )
  }

  if (isCustom) {
    return (
      <div className={className}>
        <div className="space-y-2">
          <Label className="text-sm font-medium">Custom Category</Label>
          <div className="flex gap-2">
            <Input
              value={customValue}
              onChange={(e) => handleCustomValueChange(e.target.value)}
              placeholder="Enter custom category"
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSaveCustom}
              disabled={!customValue.trim()}
            >
              <Plus className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCancelCustom}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      <Select value={value} onValueChange={handleSelectChange} required={required}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {/* Predefined Categories */}
          {CATEGORY_OPTIONS.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}

          {/* Custom Option */}
          <SelectItem value="custom" className="border-t mt-2 pt-2">
            <div className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Custom Category
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

export { CATEGORY_OPTIONS }
export type { CategorySelectProps }