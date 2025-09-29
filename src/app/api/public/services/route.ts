import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      where: { isVisible: true },
      orderBy: [
        { featured: 'desc' },
        { order: 'asc' },
        { title: 'asc' }
      ]
    })

    const payload = services.map((service) => ({
      id: service.id,
      title: service.title,
      description: service.description,
      shortDesc: service.shortDesc ?? service.description.substring(0, 100) + '...',
      icon: service.icon,
      image: service.image,
      features: service.features,
      category: service.category,
      featured: service.featured,
      order: service.order,
      isVisible: service.isVisible,
    }))

    return NextResponse.json(payload, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=300'
      }
    })
  } catch (error) {
    console.error('Failed to load public services:', error)
    return NextResponse.json({ error: 'Failed to load services' }, { status: 500 })
  }
}