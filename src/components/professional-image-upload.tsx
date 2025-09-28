"use client"

import { useState, useCallback } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Upload, X, Camera, Zap, CheckCircle, AlertCircle } from "lucide-react"
import { validateHeadshotImage, processHeadshotImage, type ProcessedImage } from '@/lib/image-processing'

interface ProfessionalImageUploadProps {
  onUpload: (url: string, path: string) => void
  currentImage?: string
  maxSize?: number // in MB
  className?: string
  showPreview?: boolean
}

export function ProfessionalImageUpload({
  onUpload,
  currentImage,
  maxSize = 50,
  className = "",
  showPreview = true
}: ProfessionalImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [processedPreview, setProcessedPreview] = useState<ProcessedImage | null>(null)
  const [validationError, setValidationError] = useState<string | null>(null)

  const handleUpload = async (files: FileList) => {
    if (!files.length) return

    const file = files[0] // Only take the first file for profile images
    setValidationError(null)

    // Validate the image
    const validation = validateHeadshotImage(file)
    if (!validation.valid) {
      setValidationError(validation.error || 'Invalid image file')
      return
    }

    setProcessing(true)

    try {
      // Process the image for professional display
      const processed = await processHeadshotImage(file, {
        width: 400,
        height: 400,
        quality: 90,
        format: 'webp',
        faceDetection: true,
        autocrop: true
      })

      setProcessedPreview(processed)
      setProcessing(false)
      setUploading(true)

      // Upload the processed image
      const response = await fetch(processed.url)
      const blob = await response.blob()

      const formData = new FormData()
      formData.append('file', blob, `profile-${Date.now()}.webp`)

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!uploadResponse.ok) {
        throw new Error('Upload failed')
      }

      const result = await uploadResponse.json()
      onUpload(result.url, result.path)

      // Clean up the processed image URL
      URL.revokeObjectURL(processed.url)
      setProcessedPreview(null)

    } catch (error) {
      console.error('Upload error:', error)
      setValidationError('Failed to process and upload image. Please try again.')

      // Clean up any processed image URL
      if (processedPreview) {
        URL.revokeObjectURL(processedPreview.url)
        setProcessedPreview(null)
      }
    } finally {
      setUploading(false)
      setProcessing(false)
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

  const clearPreview = () => {
    if (processedPreview) {
      URL.revokeObjectURL(processedPreview.url)
      setProcessedPreview(null)
    }
    setValidationError(null)
  }

  return (
    <div className={className}>
      {/* Current Image Preview */}
      {showPreview && currentImage && !processedPreview && (
        <div className="mb-4">
          <p className="text-sm font-medium mb-2">Current Profile Image</p>
          <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-border">
            <img
              src={currentImage}
              alt="Current profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Processed Preview */}
      {processedPreview && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium">Processed Preview</p>
            <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
              <CheckCircle className="w-3 h-3 mr-1" />
              Optimized
            </Badge>
          </div>
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-green-200">
            <img
              src={processedPreview.url}
              alt="Processed preview"
              className="w-full h-full object-cover"
            />
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={clearPreview}
              className="absolute top-1 right-1 h-6 w-6 p-0 rounded-full bg-white/80 hover:bg-white"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}

      {/* Upload Area */}
      <Card
        className={`border-2 border-dashed transition-colors ${
          dragActive ? 'border-primary bg-primary/5' :
          validationError ? 'border-destructive bg-destructive/5' :
          'border-muted-foreground/25'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <div className="mb-4">
            {processing ? (
              <div className="relative">
                <Camera className="h-12 w-12 text-primary animate-pulse" />
                <Zap className="h-6 w-6 text-yellow-500 absolute -top-1 -right-1 animate-bounce" />
              </div>
            ) : (
              <Camera className="h-12 w-12 text-muted-foreground" />
            )}
          </div>

          <h3 className="text-lg font-semibold mb-2">
            {processing ? 'Processing Image...' :
             uploading ? 'Uploading...' :
             'Upload Professional Photo'}
          </h3>

          {processing && (
            <div className="mb-3">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <Zap className="w-3 h-3 mr-1" />
                AI Enhancement Active
              </Badge>
            </div>
          )}

          <p className="text-sm text-muted-foreground mb-4">
            {processing ? 'Optimizing for professional display with face detection...' :
             'We\'ll automatically optimize your photo for professional display'}
          </p>

          {/* Validation Error */}
          {validationError && (
            <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <div className="flex items-center text-destructive text-sm">
                <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                {validationError}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Button
              type="button"
              onClick={() => document.getElementById('professional-image-input')?.click()}
              disabled={uploading || processing}
            >
              {uploading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  Uploading...
                </>
              ) : processing ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Choose Photo
                </>
              )}
            </Button>

            <div className="text-xs text-muted-foreground space-y-1">
              <p>Max size: {maxSize}MB • JPEG, PNG, WebP</p>
              <p>✨ Automatic face detection & cropping</p>
              <p>🎯 Professional optimization included</p>
            </div>
          </div>

          <input
            id="professional-image-input"
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileSelect}
            className="hidden"
          />
        </CardContent>
      </Card>
    </div>
  )
}