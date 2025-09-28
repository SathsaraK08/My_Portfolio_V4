import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { ADMIN_AUTH_COOKIE } from '@/lib/admin-auth'

interface RouteParams {
  params: { id: string }
}

// PUT /api/admin/certificates/[id] - Update certificate
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get(ADMIN_AUTH_COOKIE)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    const body = await request.json()

    // Check if certificate exists
    const existingCertificate = await prisma.certificate.findUnique({
      where: { id }
    })

    if (!existingCertificate) {
      return NextResponse.json({ error: 'Certificate not found' }, { status: 404 })
    }

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

    const certificate = await prisma.certificate.update({
      where: { id },
      data: {
        title: title || existingCertificate.title,
        issuer: issuer || existingCertificate.issuer,
        description: description !== undefined ? description : existingCertificate.description,
        image: image !== undefined ? image : existingCertificate.image,
        imagePath: imagePath !== undefined ? imagePath : existingCertificate.imagePath,
        credentialId: credentialId !== undefined ? credentialId : existingCertificate.credentialId,
        credentialUrl: credentialUrl !== undefined ? credentialUrl : existingCertificate.credentialUrl,
        issueDate: issueDate ? new Date(issueDate) : existingCertificate.issueDate,
        expiryDate: expiryDate ? new Date(expiryDate) : (expiryDate === null ? null : existingCertificate.expiryDate),
        skills: skills !== undefined ? skills : existingCertificate.skills,
        category: category !== undefined ? category : existingCertificate.category,
        isVerified: isVerified !== undefined ? isVerified : existingCertificate.isVerified,
        order: order !== undefined ? order : existingCertificate.order,
        isVisible: isVisible !== undefined ? isVisible : existingCertificate.isVisible
      }
    })

    return NextResponse.json(certificate)
  } catch (error) {
    console.error('Failed to update certificate:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/certificates/[id] - Delete certificate
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get(ADMIN_AUTH_COOKIE)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    // Check if certificate exists
    const existingCertificate = await prisma.certificate.findUnique({
      where: { id }
    })

    if (!existingCertificate) {
      return NextResponse.json({ error: 'Certificate not found' }, { status: 404 })
    }

    await prisma.certificate.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Certificate deleted successfully' })
  } catch (error) {
    console.error('Failed to delete certificate:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}