import { NextRequest, NextResponse } from 'next/server'
import { prisma, getConnectionPoolInfo } from '@/lib/prisma'
import { withDatabaseRetry } from '@/lib/db-utils'
import { Logger } from '@/lib/logger'
import { withRequestLogging, ErrorHandler } from '@/lib/request-logger'

// Helper function to convert BigInt to Number recursively
function convertBigIntToNumber(obj: any): any {
  if (typeof obj === 'bigint') {
    return Number(obj)
  }
  if (Array.isArray(obj)) {
    return obj.map(convertBigIntToNumber)
  }
  if (obj !== null && typeof obj === 'object') {
    const result: any = {}
    for (const [key, value] of Object.entries(obj)) {
      result[key] = convertBigIntToNumber(value)
    }
    return result
  }
  return obj
}

async function getSkillsHandler(request: NextRequest): Promise<NextResponse> {
  const startTime = Date.now()
  const operation = 'GET /api/public/home-skills'

  Logger.info('Skills API request started', {
    operation,
    timestamp: new Date().toISOString(),
    userAgent: request.headers.get('user-agent'),
  })

  try {
    // Get connection info for monitoring
    Logger.debug('Fetching connection pool info')
    const poolInfo = await getConnectionPoolInfo()

    Logger.database('Executing skills query', {
      query: 'SELECT skills WHERE isVisible = true ORDER BY order, level LIMIT 20',
      params: ['true', 20],
    })

    const queryStartTime = Date.now()
    const skills = await withDatabaseRetry(async () => {
      return await prisma.skill.findMany({
        where: { isVisible: true },
        select: {
          id: true,
          name: true,
          category: true,
          level: true,
          icon: true,
          imageUrl: true,
          order: true,
          description: true
        },
        orderBy: [
          { order: 'asc' },
          { level: 'desc' }
        ],
        take: 20 // Limit to prevent over-fetching
      })
    })
    const queryDuration = Date.now() - queryStartTime

    Logger.database('Skills query completed', {
      query: 'skills.findMany',
      duration: queryDuration,
      result: { count: skills.length },
    })

    const skillsPayload = skills.map((skill) => ({
      id: Number(skill.id),
      name: skill.name,
      category: skill.category ?? null,
      description: skill.description ?? null,
      icon: skill.icon ?? null,
      level: Number(skill.level),
      proficiency: Number(skill.level),
      imageUrl: skill.imageUrl,
      isVisible: skill.isVisible,
      order: Number(skill.order),
    }))

    // Use static title/subtitle for better performance
    const title = "Technologies & Skills"
    const subtitle = "Expertise in modern technologies and frameworks"

    // Skip the complex page sections query for now to improve performance
    // TODO: Consider implementing Redis caching for this later

    const totalDuration = Date.now() - startTime

    // Return format expected by SkillsMarquee component
    const response = {
      title,
      subtitle,
      skills: skillsPayload,
      _meta: {
        queryDuration: Number(totalDuration),
        skillsCount: Number(skillsPayload.length),
        activeConnections: Number(poolInfo.activeConnections),
        timestamp: new Date().toISOString()
      }
    }

    // Log performance metrics
    Logger.performance('Skills API completed successfully', {
      operation,
      duration: totalDuration,
      memory: process.memoryUsage(),
      database: {
        query: 'skills.findMany',
        duration: queryDuration,
        activeConnections: poolInfo.activeConnections,
      },
    })

    Logger.info('Skills API response ready', {
      skillsCount: skillsPayload.length,
      totalDuration,
      queryDuration,
      activeConnections: poolInfo.activeConnections,
    })

    // Convert any BigInt values before sending response
    const safeResponse = convertBigIntToNumber(response)

    const responseHeaders = {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      'CDN-Cache-Control': 'public, s-maxage=600',
      'Vary': 'Accept-Encoding',
      'X-Query-Duration': String(totalDuration),
      'X-DB-Duration': String(queryDuration),
      'X-Skills-Count': String(skillsPayload.length),
      'X-DB-Connections': String(poolInfo.activeConnections),
      'X-Optimized': 'true'
    }

    return NextResponse.json(safeResponse, {
      headers: responseHeaders
    })
  } catch (error) {
    const totalDuration = Date.now() - startTime

    // Enhanced error handling with full context
    const errorResult = ErrorHandler.handle(error, {
      operation,
      file: '/app/api/public/home-skills/route.ts',
      function: 'getSkillsHandler',
      additionalContext: {
        totalDuration,
        startTime,
        userAgent: request.headers.get('user-agent'),
      },
    })

    Logger.error('Skills API failed', error as Error, errorResult.context)

    // Return default data on error
    const errorResponse = {
      title: "Technologies & Skills",
      subtitle: "Expertise in modern technologies and frameworks",
      skills: [],
      _meta: {
        queryDuration: Number(totalDuration),
        skillsCount: 0,
        activeConnections: -1,
        timestamp: new Date().toISOString(),
        error: true,
        errorType: errorResult.error.name || 'Unknown',
      }
    }

    return NextResponse.json(convertBigIntToNumber(errorResponse), {
      status: 500,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Query-Duration': String(totalDuration),
        'X-Error': 'true'
      }
    })
  }
}

// Export the handler with request logging middleware
export const GET = withRequestLogging(getSkillsHandler)