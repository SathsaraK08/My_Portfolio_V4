import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { ADMIN_AUTH_COOKIE } from '@/lib/admin-auth'

interface RouteParams {
  params: { id: string }
}

// PUT /api/admin/projects/[id] - Update project
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get(ADMIN_AUTH_COOKIE)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    const body = await request.json()

    // Check if project exists
    const existingProject = await prisma.project.findUnique({
      where: { id }
    })

    if (!existingProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

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

    const project = await prisma.project.update({
      where: { id },
      data: {
        title: title || existingProject.title,
        description: description || existingProject.description,
        shortDesc: shortDesc !== undefined ? shortDesc : existingProject.shortDesc,
        content: content !== undefined ? content : existingProject.content,
        image: image !== undefined ? image : existingProject.image,
        imagePath: imagePath !== undefined ? imagePath : existingProject.imagePath,
        images: images !== undefined ? images : existingProject.images,
        techStack: techStack !== undefined ? techStack : existingProject.techStack,
        category: category || existingProject.category,
        githubUrl: githubUrl !== undefined ? githubUrl : existingProject.githubUrl,
        liveUrl: liveUrl !== undefined ? liveUrl : existingProject.liveUrl,
        status: status || existingProject.status,
        featured: featured !== undefined ? featured : existingProject.featured,
        order: order !== undefined ? order : existingProject.order,
        isVisible: isVisible !== undefined ? isVisible : existingProject.isVisible,
        startDate: startDate ? new Date(startDate) : (startDate === null ? null : existingProject.startDate),
        endDate: endDate ? new Date(endDate) : (endDate === null ? null : existingProject.endDate)
      }
    })

    return NextResponse.json(project)
  } catch (error) {
    console.error('Failed to update project:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/projects/[id] - Delete project
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get(ADMIN_AUTH_COOKIE)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    // Check if project exists
    const existingProject = await prisma.project.findUnique({
      where: { id }
    })

    if (!existingProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    await prisma.project.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Project deleted successfully' })
  } catch (error) {
    console.error('Failed to delete project:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}