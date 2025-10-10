import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const education = await prisma.education.findMany({
      where: {
        isVisible: true
      },
      orderBy: [
        { order: 'asc' },
        { startDate: 'desc' }
      ]
    })

    return NextResponse.json(education)
  } catch (error) {
    console.error('Failed to fetch education:', error)
    return NextResponse.json(
      { error: 'Failed to fetch education' },
      { status: 500 }
    )
  }
}
