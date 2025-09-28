import { Buffer } from 'node:buffer'
import { randomUUID } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'
import { getSupabaseAdminClient } from '@/lib/supabase-admin'

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'media'

function createObjectPath(fileName: string) {
  const extension = fileName.includes('.') ? fileName.split('.').pop() : 'bin'
  const cleanExtension = extension?.replace(/[^a-zA-Z0-9]/g, '') || 'bin'
  const slug = fileName
    .replace(/[^a-zA-Z0-9.-]/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60)

  const unique = randomUUID()
  return `uploads/${unique}${slug ? `-${slug}` : ''}.${cleanExtension}`
}

async function processImage(buffer: Buffer, isIcon: boolean = false): Promise<Buffer> {
  if (!isIcon) {
    return buffer
  }

  // Resize and optimize for icons
  return await sharp(buffer)
    .resize(48, 48, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .png({ quality: 90, compressionLevel: 9 })
    .toBuffer()
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')
    const shouldResize = formData.get('resize') === 'true'

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const supabase = getSupabaseAdminClient()
    const arrayBuffer = await file.arrayBuffer()
    let buffer = Buffer.from(arrayBuffer)
    let contentType = file.type || 'application/octet-stream'

    // Process image if it's an icon upload
    if (shouldResize && file.type.startsWith('image/')) {
      try {
        buffer = await processImage(buffer, true)
        contentType = 'image/png' // Convert to PNG for consistency
      } catch (error) {
        console.error('Image processing error:', error)
        // Fall back to original if processing fails
      }
    }

    const path = createObjectPath(file.name || 'upload')

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, buffer, {
        contentType,
        upsert: false,
      })

    if (error) {
      console.error('Supabase upload error:', error)
      return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET).getPublicUrl(path)

    return NextResponse.json({
      url: publicUrl,
      path,
      processed: shouldResize && file.type.startsWith('image/')
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const path = searchParams.get('path')

    if (!path) {
      return NextResponse.json({ error: 'No object path provided' }, { status: 400 })
    }

    const supabase = getSupabaseAdminClient()
    const { error } = await supabase.storage.from(BUCKET).remove([path])

    if (error) {
      console.error('Supabase delete error:', error)
      return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 })
  }
}
