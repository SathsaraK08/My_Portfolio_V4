import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { ADMIN_AUTH_COOKIE } from '@/lib/admin-auth'

// GET /api/admin/projects - Get all projects for admin
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get(ADMIN_AUTH_COOKIE)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const projects = await prisma.project.findMany({
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json(projects)
  } catch (error) {
    console.error('Failed to fetch projects:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/admin/projects - Create new project
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
      description,
      shortDesc,
      content,
      image,
      imagePath,
      images,
      techStack,
      category,
      githubUrl,
      liveUrl,
      status,
      featured,
      order,
      isVisible,
      startDate,
      endDate
    } = body

    // Validate required fields
    if (!title || !description || !category) {
      return NextResponse.json(
        { error: 'Title, description, and category are required' },
        { status: 400 }
      )
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        shortDesc: shortDesc || null,
        content: content || null,
        image: image || null,
        imagePath: imagePath || null,
        images: images || [],
        techStack: techStack || [],
        category,
        githubUrl: githubUrl || null,
        liveUrl: liveUrl || null,
        status: status || 'completed',
        featured: featured || false,
        order: order || 0,
        isVisible: isVisible !== undefined ? isVisible : true,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null
      }
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error('Failed to create project:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}