import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const updatePayload = z.object({
  name: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  level: z.number().min(0).max(100).optional(),
  icon: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  imagePath: z.string().optional().nullable(),
  isVisible: z.boolean().optional(),
  order: z.number().optional(),
})

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const payload = await request.json()
    const parsed = updatePayload.parse(payload)

    const updated = await prisma.skill.update({
      where: { id },
      data: {
        ...parsed,
        icon: parsed.icon ?? undefined,
        description: parsed.description ?? undefined,
        imageUrl: parsed.imageUrl ?? undefined,
        imagePath: parsed.imagePath ?? undefined,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid payload', details: error.flatten() }, { status: 422 })
    }

    console.error('Failed to update skill:', error)
    return NextResponse.json({ error: 'Failed to update skill' }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json({ error: 'Skill ID is required' }, { status: 400 })
    }

    await prisma.skill.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete skill:', error)
    return NextResponse.json({ error: 'Failed to delete skill' }, { status: 500 })
  }
}
