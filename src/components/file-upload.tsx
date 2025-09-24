"use client"

import { useState, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, X, Image as ImageIcon, FileText, Download } from "lucide-react"

interface FileUploadProps {
  onUpload: (url: string, publicId: string) => void
  accept?: string
  maxSize?: number // in MB
  multiple?: boolean
  className?: string
}

export function FileUpload({ 
  onUpload, 
  accept = "image/*",
  maxSize = 5,
  multiple = false,
  className = ""
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const handleUpload = async (files: FileList) => {
    if (!files.length) return

    setUploading(true)
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        
        // Check file size
        if (file.size > maxSize * 1024 * 1024) {
          alert(`File ${file.name} is too large. Maximum size is ${maxSize}MB.`)
          continue
        }

        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          throw new Error('Upload failed')
        }

        const result = await response.json()
        onUpload(result.url, result.publicId)

        if (!multiple) break
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload file. Please try again.')
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
      handleUpload(e.dataTransfer.files)
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleUpload(e.target.files)
    }
  }

  return (
    <div className={className}>
      <Card 
        className={`border-2 border-dashed transition-colors ${
          dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4">
            {accept.includes('image') ? (
              <ImageIcon className="h-12 w-12 text-muted-foreground" />
            ) : (
              <FileText className="h-12 w-12 text-muted-foreground" />
            )}
          </div>
          
          <h3 className="text-lg font-semibold mb-2">
            {uploading ? 'Uploading...' : 'Upload Files'}
          </h3>
          
          <p className="text-sm text-muted-foreground mb-4">
            Drag and drop files here, or click to browse
          </p>
          
          <div className="space-y-2">
            <Button 
              onClick={() => document.getElementById('file-input')?.click()}
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Choose Files
                </>
              )}
            </Button>
            
            <p className="text-xs text-muted-foreground">
              Max size: {maxSize}MB • {accept}
            </p>
          </div>

          <input
            id="file-input"
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleFileSelect}
            className="hidden"
          />
        </CardContent>
      </Card>
    </div>
  )
}

interface UploadedFileProps {
  url: string
  publicId: string
  onRemove: () => void
  className?: string
}

export function UploadedFile({ url, publicId, onRemove, className = "" }: UploadedFileProps) {
  const [removing, setRemoving] = useState(false)
  
  const handleRemove = async () => {
    setRemoving(true)
    
    try {
      const response = await fetch(`/api/upload?publicId=${publicId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        onRemove()
      } else {
        throw new Error('Failed to delete file')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Failed to delete file')
    } finally {
      setRemoving(false)
    }
  }

  const isImage = url.match(/\.(jpg|jpeg|png|gif|webp)$/i)

  return (
    <Card className={`relative ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          {isImage ? (
            <img
              src={url}
              alt="Uploaded file"
              className="h-16 w-16 rounded object-cover"
            />
          ) : (
            <div className="h-16 w-16 rounded bg-muted flex items-center justify-center">
              <FileText className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {publicId.split('/').pop()}
            </p>
            <p className="text-xs text-muted-foreground">
              Uploaded successfully
            </p>
          </div>

          <div className="flex space-x-1">
            <Button
              size="sm"
              variant="outline"
              asChild
            >
              <a href={url} target="_blank" rel="noopener noreferrer">
                <Download className="h-3 w-3" />
              </a>
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={handleRemove}
              disabled={removing}
            >
              {removing ? (
                <div className="h-3 w-3 animate-spin rounded-full border border-current border-t-transparent" />
              ) : (
                <X className="h-3 w-3" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}