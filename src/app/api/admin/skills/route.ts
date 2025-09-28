import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const skillPayload = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  level: z.number().min(0).max(100),
  icon: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  imagePath: z.string().optional().nullable(),
  isVisible: z.boolean().optional(),
  order: z.number().optional(),
})

export async function GET() {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: [
        { category: 'asc' },
        { order: 'asc' },
        { level: 'desc' },
        { name: 'asc' }
      ],
    })

    return NextResponse.json(skills)
  } catch (error) {
    console.error('Failed to fetch skills:', error)
    return NextResponse.json({ error: 'Failed to load skills' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()
    const parsed = skillPayload.parse(payload)

    const created = await prisma.skill.create({
      data: {
        name: parsed.name,
        category: parsed.category,
        level: parsed.level,
        icon: parsed.icon ?? null,
        description: parsed.description ?? null,
        imageUrl: parsed.imageUrl ?? null,
        imagePath: parsed.imagePath ?? null,
        isVisible: parsed.isVisible ?? true,
        order: parsed.order ?? 0,
      },
    })

    return NextResponse.json(created, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid payload', details: error.flatten() }, { status: 422 })
    }

    console.error('Failed to create skill:', error)
    return NextResponse.json({ error: 'Failed to create skill' }, { status: 500 })
  }
}
