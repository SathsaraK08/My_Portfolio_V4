import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { ADMIN_AUTH_COOKIE } from '@/lib/admin-auth'

// GET /api/admin/pages - Get all pages for admin
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get(ADMIN_AUTH_COOKIE)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const pages = await prisma.page.findMany({
      include: {
        sections: {
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { order: 'asc' }
    })

    return NextResponse.json(pages)
  } catch (error) {
    console.error('Failed to fetch pages:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/admin/pages - Create new page
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get(ADMIN_AUTH_COOKIE)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      name,
      title,
      description,
      slug,
      isVisible,
      order
    } = body

    // Validate required fields
    if (!name || !title || !slug) {
      return NextResponse.json(
        { error: 'Name, title, and slug are required' },
        { status: 400 }
      )
    }

    const page = await prisma.page.create({
      data: {
        name,
        title,
        description: description || null,
        slug,
        isVisible: isVisible !== undefined ? isVisible : true,
        order: order || 0
      },
      include: {
        sections: {
          orderBy: { order: 'asc' }
        }
      }
    })

    return NextResponse.json(page, { status: 201 })
  } catch (error) {
    console.error('Failed to create page:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}