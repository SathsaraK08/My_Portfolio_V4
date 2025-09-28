import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { ADMIN_AUTH_COOKIE } from '@/lib/admin-auth'

interface RouteParams {
  params: { id: string }
}

// PUT /api/admin/education/[id] - Update education record
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get(ADMIN_AUTH_COOKIE)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    const body = await request.json()

    // Check if education record exists
    const existingEducation = await prisma.education.findUnique({
      where: { id }
    })

    if (!existingEducation) {
      return NextResponse.json({ error: 'Education record not found' }, { status: 404 })
    }

    const {
      institution,
      degree,
      field,
      description,
      grade,
      startDate,
      endDate,
      isCurrent,
      location,
      achievements,
      order,
      isVisible
    } = body

    const education = await prisma.education.update({
      where: { id },
      data: {
        institution: institution || existingEducation.institution,
        degree: degree || existingEducation.degree,
        field: field !== undefined ? field : existingEducation.field,
        description: description !== undefined ? description : existingEducation.description,
        grade: grade !== undefined ? grade : existingEducation.grade,
        startDate: startDate ? new Date(startDate) : existingEducation.startDate,
        endDate: endDate ? new Date(endDate) : (endDate === null ? null : existingEducation.endDate),
        isCurrent: isCurrent !== undefined ? isCurrent : existingEducation.isCurrent,
        location: location !== undefined ? location : existingEducation.location,
        achievements: achievements !== undefined ? achievements : existingEducation.achievements,
        order: order !== undefined ? order : existingEducation.order,
        isVisible: isVisible !== undefined ? isVisible : existingEducation.isVisible
      }
    })

    return NextResponse.json(education)
  } catch (error) {
    console.error('Failed to update education:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/education/[id] - Delete education record
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get(ADMIN_AUTH_COOKIE)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    // Check if education record exists
    const existingEducation = await prisma.education.findUnique({
      where: { id }
    })

    if (!existingEducation) {
      return NextResponse.json({ error: 'Education record not found' }, { status: 404 })
    }

    await prisma.education.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Education record deleted successfully' })
  } catch (error) {
    console.error('Failed to delete education:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}