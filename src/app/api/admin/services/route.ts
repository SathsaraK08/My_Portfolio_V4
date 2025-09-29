/**
 * Admin Services API Routes
 *
 * Handles CRUD operations for services management:
 * - GET: List all services (admin view)
 * - POST: Create new service
 *
 * @route /api/admin/services
 * @access Protected (Admin only)
 * @author Portfolio API System
 * @version 2.0.0
 */

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/admin/services
 *
 * Retrieves all services for admin management.
 * Returns services ordered by: featured (desc), order (asc), title (asc)
 */
export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: [
        { featured: 'desc' },  // Featured services first
        { order: 'asc' },      // Then by custom order
        { title: 'asc' }       // Finally alphabetically
      ]
    })

    return NextResponse.json(services)
  } catch (error) {
    console.error('Failed to load services:', error)
    return NextResponse.json({ error: 'Failed to load services' }, { status: 500 })
  }
}

/**
 * POST /api/admin/services
 *
 * Creates a new service with auto-generated order number.
 * Automatically assigns the next available order number if not provided.
 */
export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Auto-generate order number if not provided
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
        order: data.order ?? (maxOrder?.order || 0) + 1,  // Auto-increment order
        isVisible: data.isVisible ?? true,
      }
    })

    return NextResponse.json(service, { status: 201 })
  } catch (error) {
    console.error('Failed to create service:', error)
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 })
  }
}