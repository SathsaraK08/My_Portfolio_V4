import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: [
        { featured: 'desc' },
        { order: 'asc' },
        { title: 'asc' }
      ]
    })

    return NextResponse.json(services)
  } catch (error) {
    console.error('Failed to load services:', error)
    return NextResponse.json({ error: 'Failed to load services' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Get the highest order number and add 1
    const maxOrder = await prisma.service.findFirst({
      orderBy: { order: 'desc' },
      select: { order: true }
    })

    const service = await prisma.service.create({
      data: {
        title: data.title,
        description: data.description,
        shortDesc: data.shortDesc,
        icon: data.icon,
        image: data.image,
        features: data.features || [],
        pricing: data.pricing,
        category: data.category,
        featured: data.featured || false,
        order: data.order ?? (maxOrder?.order || 0) + 1,
        isVisible: data.isVisible ?? true,
      }
    })

    return NextResponse.json(service, { status: 201 })
  } catch (error) {
    console.error('Failed to create service:', error)
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 })
  }
}