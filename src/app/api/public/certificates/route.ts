import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/public/certificates - Get all visible certificates for public display
export async function GET() {
  try {
    const certificates = await prisma.certificate.findMany({
      where: {
        isVisible: true
      },
      orderBy: [
        { order: 'asc' },
        { issueDate: 'desc' }
      ]
    })

    return NextResponse.json(certificates)
  } catch (error) {
    console.error('Failed to fetch certificates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch certificates' },
      { status: 500 }
    )
  }
}
