/**
 * Image processing utilities for professional headshots
 * Handles face detection, cropping, and optimization
 */

export interface ImageProcessingOptions {
  width?: number
  height?: number
  quality?: number
  format?: 'webp' | 'jpeg' | 'png'
  faceDetection?: boolean
  autocrop?: boolean
}

export interface ProcessedImage {
  url: string
  width: number
  height: number
  format: string
  size: number
}

/**
 * Process uploaded image for professional headshot display
 */
export async function processHeadshotImage(
  file: File,
  options: ImageProcessingOptions = {}
): Promise<ProcessedImage> {
  const {
    width = 400,
    height = 400,
    quality = 85,
    format = 'webp',
    faceDetection = true,
    autocrop = true
  } = options

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = async () => {
      try {
        // Set canvas dimensions
        canvas.width = width
        canvas.height = height

        let sourceX = 0
        let sourceY = 0
        let sourceWidth = img.width
        let sourceHeight = img.height

        if (autocrop) {
          // Calculate crop dimensions for square aspect ratio
          const size = Math.min(img.width, img.height)
          sourceX = (img.width - size) / 2
          sourceY = (img.height - size) / 2
          sourceWidth = size
          sourceHeight = size

          // Apply intelligent face-centered cropping if possible
          if (faceDetection && 'FaceDetector' in window) {
            try {
              const faceDetector = new (window as any).FaceDetector()
              const faces = await faceDetector.detect(img)

              if (faces.length > 0) {
                const face = faces[0]
                const faceCenterX = face.boundingBox.x + face.boundingBox.width / 2
                const faceCenterY = face.boundingBox.y + face.boundingBox.height / 2

                // Adjust crop to center on face
                sourceX = Math.max(0, faceCenterX - size / 2)
                sourceY = Math.max(0, faceCenterY - size / 2)

                // Ensure crop doesn't exceed image bounds
                if (sourceX + size > img.width) {
                  sourceX = img.width - size
                }
                if (sourceY + size > img.height) {
                  sourceY = img.height - size
                }
              }
            } catch (faceError) {
              console.log('Face detection not available, using center crop')
            }
          }
        }

        // Clear canvas with white background
        if (ctx) {
          ctx.fillStyle = '#ffffff'
          ctx.fillRect(0, 0, width, height)

          // Draw the cropped image
          ctx.drawImage(
            img,
            sourceX,
            sourceY,
            sourceWidth,
            sourceHeight,
            0,
            0,
            width,
            height
          )

          // Convert to blob with specified format and quality
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const url = URL.createObjectURL(blob)
                resolve({
                  url,
                  width,
                  height,
                  format,
                  size: blob.size
                })
              } else {
                reject(new Error('Failed to process image'))
              }
            },
            `image/${format}`,
            format === 'jpeg' ? quality / 100 : undefined
          )
        } else {
          reject(new Error('Canvas context not available'))
        }
      } catch (error) {
        reject(error)
      }
    }

    img.onerror = () => {
      reject(new Error('Failed to load image'))
    }

    img.src = URL.createObjectURL(file)
  })
}

/**
 * Validate image file for headshot processing
 */
export function validateHeadshotImage(file: File): { valid: boolean; error?: string } {
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Please upload a JPEG, PNG, or WebP image file'
    }
  }

  // Check file size (50MB limit)
  const maxSize = 50 * 1024 * 1024
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'Image file size must be less than 50MB'
    }
  }

  return { valid: true }
}

/**
 * Generate multiple image sizes for responsive display
 */
export async function generateResponsiveImages(
  file: File
): Promise<{ [size: string]: ProcessedImage }> {
  const sizes = {
    thumbnail: { width: 150, height: 150 },
    medium: { width: 300, height: 300 },
    large: { width: 500, height: 500 },
    xlarge: { width: 800, height: 800 }
  }

  const results: { [size: string]: ProcessedImage } = {}

  for (const [sizeName, dimensions] of Object.entries(sizes)) {
    try {
      results[sizeName] = await processHeadshotImage(file, {
        ...dimensions,
        quality: sizeName === 'thumbnail' ? 70 : 85,
        format: 'webp'
      })
    } catch (error) {
      console.error(`Failed to generate ${sizeName} size:`, error)
      // Fallback to original if processing fails
      results[sizeName] = {
        url: URL.createObjectURL(file),
        width: dimensions.width,
        height: dimensions.height,
        format: 'original',
        size: file.size
      }
    }
  }

  return results
}

/**
 * Clean up blob URLs to prevent memory leaks
 */
export function cleanupImageUrls(images: ProcessedImage[]): void {
  images.forEach(image => {
    if (image.url.startsWith('blob:')) {
      URL.revokeObjectURL(image.url)
    }
  })
}