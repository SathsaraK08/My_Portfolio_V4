import { NextRequest, NextResponse } from 'next/server'
import { Logger } from './logger'

interface RequestLogData {
  method: string
  url: string
  userAgent: string
  ip: string
  timestamp: string
  responseTime?: number
  statusCode?: number
  errorDetails?: any
  headers: Record<string, string>
  query: Record<string, string | string[]>
  body?: any
}

// Memory-efficient request tracking
class RequestTracker {
  private static requests = new Map<string, { startTime: number; data: RequestLogData }>()
  private static readonly MAX_CONCURRENT_REQUESTS = 1000
  private static cleanupInterval: NodeJS.Timeout | null = null

  static startRequest(request: NextRequest): string {
    const requestId = this.generateRequestId()
    const startTime = Date.now()

    // Get client IP with fallbacks
    const ip = this.getClientIP(request)

    // Parse URL
    const url = new URL(request.url)

    const requestData: RequestLogData = {
      method: request.method,
      url: url.pathname + url.search,
      userAgent: request.headers.get('user-agent') || 'unknown',
      ip,
      timestamp: new Date().toISOString(),
      headers: this.extractSafeHeaders(request.headers),
      query: Object.fromEntries(url.searchParams.entries()),
    }

    // Add body for POST/PUT/PATCH requests
    if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
      this.extractBody(request).then(body => {
        this.requests.get(requestId)!.data.body = body
      }).catch(() => {
        // Ignore body parsing errors
      })
    }

    this.requests.set(requestId, { startTime, data: requestData })

    // Memory management - cleanup old requests
    this.startCleanupIfNeeded()

    // Log the incoming request
    Logger.http('Incoming request', {
      method: request.method,
      url: requestData.url,
      userAgent: requestData.userAgent,
      ip: requestData.ip,
      headers: requestData.headers,
      query: requestData.query,
    })

    return requestId
  }

  static endRequest(requestId: string, response: NextResponse, error?: Error) {
    const requestInfo = this.requests.get(requestId)
    if (!requestInfo) return

    const responseTime = Date.now() - requestInfo.startTime
    const { data } = requestInfo

    // Update request data
    data.responseTime = responseTime
    data.statusCode = response.status

    if (error) {
      data.errorDetails = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      }
    }

    // Log the completed request
    if (error || response.status >= 400) {
      Logger.error('Request failed', error, {
        requestId,
        method: data.method,
        url: data.url,
        statusCode: data.statusCode,
        responseTime: data.responseTime,
        userAgent: data.userAgent,
        ip: data.ip,
      })
    } else {
      Logger.http('Request completed', {
        method: data.method,
        url: data.url,
        statusCode: data.statusCode,
        responseTime: data.responseTime,
        userAgent: data.userAgent,
        ip: data.ip,
      })
    }

    // Log traffic analytics
    Logger.traffic('API Traffic', {
      endpoint: data.url,
      method: data.method,
      responseTime: data.responseTime,
      statusCode: data.statusCode!,
      userAgent: data.userAgent,
      uniqueVisitor: this.isUniqueVisitor(data.ip),
    })

    // Performance monitoring for slow requests
    if (responseTime > 3000) {
      Logger.performance('Slow request detected', {
        operation: `${data.method} ${data.url}`,
        duration: responseTime,
        memory: process.memoryUsage(),
      })
    }

    // Cleanup
    this.requests.delete(requestId)
  }

  private static generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private static getClientIP(request: NextRequest): string {
    // Try various headers that might contain the real IP
    const headers = [
      'x-forwarded-for',
      'x-real-ip',
      'x-client-ip',
      'cf-connecting-ip', // Cloudflare
      'fastly-client-ip', // Fastly
      'x-cluster-client-ip',
    ]

    for (const header of headers) {
      const value = request.headers.get(header)
      if (value) {
        // x-forwarded-for can be a comma-separated list
        const ip = value.split(',')[0].trim()
        if (ip && ip !== 'unknown') {
          return ip
        }
      }
    }

    return 'unknown'
  }

  private static extractSafeHeaders(headers: Headers): Record<string, string> {
    const safeHeaders: Record<string, string> = {}
    const allowedHeaders = [
      'accept',
      'accept-encoding',
      'accept-language',
      'cache-control',
      'content-type',
      'content-length',
      'host',
      'origin',
      'referer',
      'user-agent',
      'x-forwarded-for',
      'x-real-ip',
    ]

    headers.forEach((value, key) => {
      if (allowedHeaders.includes(key.toLowerCase())) {
        safeHeaders[key] = value
      }
    })

    return safeHeaders
  }

  private static async extractBody(request: NextRequest): Promise<any> {
    try {
      const contentType = request.headers.get('content-type') || ''

      if (contentType.includes('application/json')) {
        const body = await request.json()
        // Sanitize sensitive fields
        return this.sanitizeRequestBody(body)
      } else if (contentType.includes('application/x-www-form-urlencoded')) {
        const formData = await request.formData()
        const body: Record<string, any> = {}
        formData.forEach((value, key) => {
          body[key] = value
        })
        return this.sanitizeRequestBody(body)
      }
    } catch {
      // Return null if body can't be parsed
    }

    return null
  }

  private static sanitizeRequestBody(body: any): any {
    if (typeof body !== 'object' || body === null) return body

    const sensitiveFields = ['password', 'token', 'secret', 'key', 'auth', 'credential', 'otp']
    const sanitized = { ...body }

    Object.keys(sanitized).forEach(key => {
      if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
        sanitized[key] = '[REDACTED]'
      }
    })

    return sanitized
  }

  private static isUniqueVisitor(ip: string): boolean {
    // Simple unique visitor tracking (in production, use Redis or database)
    const key = `visitor_${ip}_${new Date().toDateString()}`
    // This is a placeholder - in production, implement proper unique visitor tracking
    return Math.random() < 0.3 // 30% chance for demo purposes
  }

  private static startCleanupIfNeeded() {
    if (this.requests.size > this.MAX_CONCURRENT_REQUESTS && !this.cleanupInterval) {
      this.cleanupInterval = setInterval(() => {
        this.cleanupOldRequests()
      }, 60000) // Cleanup every minute
    }
  }

  private static cleanupOldRequests() {
    const now = Date.now()
    const maxAge = 5 * 60 * 1000 // 5 minutes

    for (const [requestId, { startTime }] of this.requests.entries()) {
      if (now - startTime > maxAge) {
        this.requests.delete(requestId)
        Logger.warn('Request tracking timeout', { requestId, age: now - startTime })
      }
    }

    // Stop cleanup if requests are under control
    if (this.requests.size < this.MAX_CONCURRENT_REQUESTS / 2 && this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
      this.cleanupInterval = null
    }
  }

  static getActiveRequestsCount(): number {
    return this.requests.size
  }

  static getMemoryUsage(): { requestTracker: number; total: NodeJS.MemoryUsage } {
    return {
      requestTracker: this.requests.size,
      total: process.memoryUsage(),
    }
  }
}

// Middleware function for API routes
export function withRequestLogging<T extends any[]>(
  handler: (...args: T) => Promise<NextResponse>
) {
  return async (...args: T): Promise<NextResponse> => {
    const request = args[0] as NextRequest
    const requestId = RequestTracker.startRequest(request)

    try {
      const response = await handler(...args)
      RequestTracker.endRequest(requestId, response)

      // Add request ID to response headers for debugging
      response.headers.set('X-Request-ID', requestId)

      return response
    } catch (error) {
      const errorResponse = NextResponse.json(
        { error: 'Internal Server Error', requestId },
        { status: 500 }
      )

      RequestTracker.endRequest(requestId, errorResponse, error as Error)

      return errorResponse
    }
  }
}

// Enhanced error handler with full stack traces
export class ErrorHandler {
  static handle(error: unknown, context: {
    operation: string
    file?: string
    line?: number
    function?: string
    additionalContext?: Record<string, any>
  }) {
    const errorInfo = {
      operation: context.operation,
      timestamp: new Date().toISOString(),
      file: context.file,
      line: context.line,
      function: context.function,
      context: context.additionalContext,
      memory: process.memoryUsage(),
      activeRequests: RequestTracker.getActiveRequestsCount(),
    }

    if (error instanceof Error) {
      Logger.error(`${context.operation} failed`, error, errorInfo)

      // Log additional error details
      if (error.cause) {
        Logger.error('Error cause', error.cause as Error, errorInfo)
      }

      return {
        success: false,
        error: {
          name: error.name,
          message: error.message,
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        },
        context: errorInfo,
      }
    } else {
      Logger.error(`${context.operation} failed with unknown error`, error, errorInfo)

      return {
        success: false,
        error: {
          message: 'Unknown error occurred',
          details: error,
        },
        context: errorInfo,
      }
    }
  }
}

export { RequestTracker }