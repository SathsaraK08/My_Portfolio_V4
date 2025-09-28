"use client"

import { useState, useCallback, useRef } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload, X, Image as ImageIcon, Link, Palette } from "lucide-react"
import Image from 'next/image'

interface IconUploadProps {
  value?: string
  onChange: (iconData: { type: 'upload' | 'url' | 'emoji'; value: string; imageUrl?: string }) => void
  className?: string
  onUploadStateChange?: (state: { isUploading: boolean; imageUrl?: string }) => void
}

export function IconUpload({ value, onChange, className = "", onUploadStateChange }: IconUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [activeTab, setActiveTab] = useState<'upload' | 'url' | 'emoji'>('upload')
  const [urlInput, setUrlInput] = useState('')
  const [emojiInput, setEmojiInput] = useState('')
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (files: FileList) => {
    if (!files.length) return

    const file = files[0]

    // Check if it's an image
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, SVG, etc.)')
      return
    }

    // Check file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      alert('File size must be less than 50MB')
      return
    }

    setUploading(true)
    setUploadError(null)
    onUploadStateChange?.({ isUploading: true })

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('resize', 'true') // Signal for icon resizing

      // Create abort controller for timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 300000) // 5 minute timeout for large files

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Upload failed with status ${response.status}`)
      }

      const result = await response.json()

      if (!result.url) {
        throw new Error('Upload completed but no URL returned')
      }

      onChange({
        type: 'upload',
        value: file.name,
        imageUrl: result.url
      })
      onUploadStateChange?.({ isUploading: false, imageUrl: result.url })

      console.log('✅ Icon uploaded successfully:', result.url)
    } catch (error) {
      console.error('Upload error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Upload failed'
      setUploadError(errorMessage)
      onUploadStateChange?.({ isUploading: false })

      // Show user-friendly error message
      if (errorMessage.includes('413') || errorMessage.includes('too large')) {
        alert('File is too large. Please choose a file smaller than 50MB.')
      } else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
        alert('Network error. Please check your connection and try again.')
      } else if (errorMessage.includes('aborted') || errorMessage.includes('timeout')) {
        alert('Upload timed out. Please try uploading a smaller file or check your connection.')
      } else {
        alert(`Failed to upload icon: ${errorMessage}`)
      }
    } finally {
      setUploading(false)
    }
  }

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setUploadError(null) // Clear any previous errors
      handleFileUpload(e.dataTransfer.files)
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadError(null) // Clear any previous errors
      handleFileUpload(e.target.files)
    }
  }

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange({
        type: 'url',
        value: urlInput.trim(),
        imageUrl: urlInput.trim()
      })
      setUrlInput('')
    }
  }

  const handleEmojiSubmit = () => {
    if (emojiInput.trim()) {
      onChange({
        type: 'emoji',
        value: emojiInput.trim()
      })
      setEmojiInput('')
    }
  }

  const commonEmojis = ['⚛️', '🔧', '💻', '🎨', '📱', '🌐', '⚡', '🚀', '📊', '🔒', '🛠️', '📝', '🎯', '💡', '🔥', '⭐']

  return (
    <div className={className}>
      <div className="space-y-4">
        {/* Tab Navigation */}
        <div className="flex space-x-1 rounded-lg bg-muted p-1">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === 'upload'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Upload className="inline h-4 w-4 mr-1" />
            Upload
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === 'url'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Link className="inline h-4 w-4 mr-1" />
            URL
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('emoji')}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === 'emoji'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Palette className="inline h-4 w-4 mr-1" />
            Emoji
          </button>
        </div>

        {/* Upload Tab */}
        {activeTab === 'upload' && (
          <Card
            className={`border-2 border-dashed transition-colors ${
              dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <CardContent className="flex flex-col items-center justify-center py-8 text-center">
              <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground mb-3">
                Drag and drop an icon, or click to browse
              </p>
              <Button
                type="button"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <div className="mr-2 h-3 w-3 animate-spin rounded-full border-2 border-background border-t-transparent" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-3 w-3" />
                    Choose File
                  </>
                )}
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                PNG, JPG, SVG • Max 50MB • Auto-resized to 48x48
              </p>

              {uploadError && (
                <div className="mt-3 p-2 bg-destructive/10 border border-destructive/20 rounded-md">
                  <p className="text-xs text-destructive">{uploadError}</p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </CardContent>
          </Card>
        )}

        {/* URL Tab */}
        {activeTab === 'url' && (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <Input
                    placeholder="https://example.com/icon.svg"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
                  />
                  <Button type="button" onClick={handleUrlSubmit} size="sm">
                    Add
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Use a direct link to an icon image (SVG, PNG, etc.)
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Emoji Tab */}
        {activeTab === 'emoji' && (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="⚛️ or any emoji"
                    value={emojiInput}
                    onChange={(e) => setEmojiInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleEmojiSubmit()}
                    className="text-center"
                  />
                  <Button type="button" onClick={handleEmojiSubmit} size="sm">
                    Add
                  </Button>
                </div>

                <div className="grid grid-cols-8 gap-2">
                  {commonEmojis.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => onChange({ type: 'emoji', value: emoji })}
                      className="aspect-square rounded-md border border-border/50 bg-background hover:bg-muted transition-colors flex items-center justify-center text-lg"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>

                <p className="text-xs text-muted-foreground">
                  Click an emoji above or type your own
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Current Icon Preview */}
        {value && (
          <Card className="bg-muted/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-lg bg-background border flex items-center justify-center overflow-hidden">
                    {value.startsWith('http') ? (
                      <Image
                        src={value}
                        alt="Icon"
                        width={32}
                        height={32}
                        className="object-contain"
                      />
                    ) : (
                      <span className="text-lg">{value}</span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">Current Icon</p>
                    <p className="text-xs text-muted-foreground">
                      {value.startsWith('http') ? 'URL' : value.length > 2 ? 'Uploaded' : 'Emoji'}
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => onChange({ type: 'emoji', value: '' })}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
