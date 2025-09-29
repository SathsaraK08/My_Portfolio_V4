import { NextResponse } from 'next/server'
import { checkPrismaConnection, getConnectionPoolInfo } from '@/lib/prisma'

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

export async function GET() {
  const startTime = Date.now()

  try {
    // Check database connection
    const dbHealthy = await checkPrismaConnection()
    const poolInfo = await getConnectionPoolInfo()

    const responseTime = Date.now() - startTime
    const timestamp = new Date().toISOString()

    const healthData = {
      status: dbHealthy ? 'healthy' : 'unhealthy',
      timestamp,
      responseTime,
      database: {
        connected: dbHealthy,
        activeConnections: poolInfo.activeConnections
      },
      environment: process.env.NODE_ENV,
      uptime: process.uptime(),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        external: Math.round(process.memoryUsage().external / 1024 / 1024),
        rss: Math.round(process.memoryUsage().rss / 1024 / 1024)
      }
    }

    return NextResponse.json(convertBigIntToNumber(healthData), {
      status: dbHealthy ? 200 : 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Response-Time': String(responseTime)
      }
    })
  } catch (error) {
    const responseTime = Date.now() - startTime

    const errorData = {
      status: 'error',
      timestamp: new Date().toISOString(),
      responseTime,
      error: error instanceof Error ? error.message : 'Unknown error',
      database: {
        connected: false,
        activeConnections: -1
      }
    }

    return NextResponse.json(convertBigIntToNumber(errorData), {
      status: 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Response-Time': String(responseTime)
      }
    })
  }
}