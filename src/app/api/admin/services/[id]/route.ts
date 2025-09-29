import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const service = await prisma.service.findUnique({
      where: { id }
    })

    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 })
    }

    return NextResponse.json(service)
  } catch (error) {
    console.error('Failed to load service:', error)
    return NextResponse.json({ error: 'Failed to load service' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await request.json()

    const service = await prisma.service.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        shortDesc: data.shortDesc,
        icon: data.icon,
        image: data.image,
        features: data.features || [],
        pricing: data.pricing,
        category: data.category,
        featured: data.featured,
        order: data.order,
        isVisible: data.isVisible,
      }
    })

    return NextResponse.json(service)
  } catch (error) {
    console.error('Failed to update service:', error)
    return NextResponse.json({ error: 'Failed to update service' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.service.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Service deleted successfully' })
  } catch (error) {
    console.error('Failed to delete service:', error)
    return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 })
  }
}