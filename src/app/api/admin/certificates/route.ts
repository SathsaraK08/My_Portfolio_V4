import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { ADMIN_AUTH_COOKIE } from '@/lib/admin-auth'

// GET /api/admin/certificates - Get all certificates for admin
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get(ADMIN_AUTH_COOKIE)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const certificates = await prisma.certificate.findMany({
      orderBy: [
        { order: 'asc' },
        { issueDate: 'desc' }
      ]
    })

    return NextResponse.json(certificates)
  } catch (error) {
    console.error('Failed to fetch certificates:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/admin/certificates - Create new certificate
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get(ADMIN_AUTH_COOKIE)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      title,
      issuer,
      description,
      image,
      imagePath,
      credentialId,
      credentialUrl,
      issueDate,
      expiryDate,
      skills,
      category,
      isVerified,
      order,
      isVisible
    } = body

    // Validate required fields
    if (!title || !issuer || !issueDate) {
      return NextResponse.json(
        { error: 'Title, issuer, and issue date are required' },
        { status: 400 }
      )
    }

    const certificate = await prisma.certificate.create({
      data: {
        title,
        issuer,
        description: description || null,
        image: image || null,
        imagePath: imagePath || null,
        credentialId: credentialId || null,
        credentialUrl: credentialUrl || null,
        issueDate: new Date(issueDate),
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        skills: skills || [],
        category: category || null,
        isVerified: isVerified || false,
        order: order || 0,
        isVisible: isVisible !== undefined ? isVisible : true
      }
    })

    return NextResponse.json(certificate, { status: 201 })
  } catch (error) {
    console.error('Failed to create certificate:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}