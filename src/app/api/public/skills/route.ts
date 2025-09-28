import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const skills = await prisma.skill.findMany({
      where: { isVisible: true },
      orderBy: [
        { category: 'asc' },
        { order: 'asc' },
        { level: 'desc' },
        { name: 'asc' }
      ]
    })

    const payload = skills.map((skill) => ({
      id: skill.id,
      name: skill.name,
      category: skill.category ?? null,
      description: skill.description ?? null,
      icon: skill.icon ?? null,
      level: skill.level,
      proficiency: skill.level, // Keep for backward compatibility
      imageUrl: skill.imageUrl,
      isVisible: skill.isVisible,
      order: skill.order,
    }))

    return NextResponse.json(payload, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=300'
      }
    })
  } catch (error) {
    console.error('Failed to load public skills:', error)
    return NextResponse.json({ error: 'Failed to load skills' }, { status: 500 })
  }
}
