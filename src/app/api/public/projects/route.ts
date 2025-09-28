import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit')
    const featured = searchParams.get('featured')
    const category = searchParams.get('category')

    const whereClause: any = {
      isVisible: true
    }

    if (featured === 'true') {
      whereClause.featured = true
    }

    if (category && category !== 'all') {
      whereClause.category = category
    }

    const projects = await prisma.project.findMany({
      where: whereClause,
      orderBy: [
        { featured: 'desc' },
        { order: 'asc' },
        { createdAt: 'desc' }
      ],
      take: limit ? parseInt(limit) : undefined
    })

    return NextResponse.json(projects, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=300'
      }
    })
  } catch (error) {
    console.error('Failed to load projects:', error)
    return NextResponse.json({ error: 'Failed to load projects' }, { status: 500 })
  }
}