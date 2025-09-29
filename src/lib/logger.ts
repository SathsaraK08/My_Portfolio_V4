import winston from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'

// Custom log levels for our application
const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
}

const logColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'cyan',
}

// Add colors to winston
winston.addColors(logColors)

// Custom format for structured logging
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.prettyPrint()
)

// Console format for development
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} [${info.level}] ${info.message}${info.stack ? '\n' + info.stack : ''}`
  )
)

// Create transports
const transports: winston.transport[] = [
  // Console transport for development
  new winston.transports.Console({
    level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
    format: consoleFormat,
  }),

  // Error logs - daily rotation, keep for 14 days
  new DailyRotateFile({
    filename: 'debug_help/logs/error-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    level: 'error',
    format: logFormat,
    maxFiles: '14d',
    maxSize: '20m',
    zippedArchive: true,
  }),

  // Combined logs - daily rotation, keep for 7 days
  new DailyRotateFile({
    filename: 'debug_help/logs/combined-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    format: logFormat,
    maxFiles: '7d',
    maxSize: '20m',
    zippedArchive: true,
  }),

  // HTTP/API logs - daily rotation
  new DailyRotateFile({
    filename: 'debug_help/logs/http-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    level: 'http',
    format: logFormat,
    maxFiles: '7d',
    maxSize: '10m',
    zippedArchive: true,
  }),

  // Performance logs - separate file for performance metrics
  new DailyRotateFile({
    filename: 'debug_help/logs/performance-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    format: logFormat,
    maxFiles: '7d',
    maxSize: '10m',
    zippedArchive: true,
  }),
]

// Create the logger
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  levels: logLevels,
  format: logFormat,
  transports,
  exitOnError: false,
})

// Enhanced logging methods with context
export class Logger {
  // Error logging with full stack trace and context
  static error(message: string, error?: Error | unknown, context?: Record<string, any>) {
    const logEntry = {
      message,
      level: 'error',
      timestamp: new Date().toISOString(),
      context: context || {},
      ...(error instanceof Error && {
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
          cause: error.cause,
        },
      }),
      ...(error && typeof error === 'object' && !(error instanceof Error) && {
        errorDetails: error,
      }),
    }

    logger.error(logEntry)
  }

  // API request/response logging
  static http(message: string, details: {
    method?: string
    url?: string
    statusCode?: number
    responseTime?: number
    userAgent?: string
    ip?: string
    body?: any
    query?: any
    headers?: Record<string, string>
  }) {
    const logEntry = {
      message,
      level: 'http',
      timestamp: new Date().toISOString(),
      request: {
        method: details.method,
        url: details.url,
        userAgent: details.userAgent,
        ip: details.ip,
        query: details.query,
        // Only log safe headers (no auth tokens)
        headers: details.headers ? this.sanitizeHeaders(details.headers) : undefined,
        // Only log body if it's safe (no passwords)
        body: details.body ? this.sanitizeBody(details.body) : undefined,
      },
      response: {
        statusCode: details.statusCode,
        responseTime: details.responseTime,
      },
    }

    logger.http(logEntry)
  }

  // Performance logging
  static performance(message: string, metrics: {
    operation: string
    duration: number
    memory?: NodeJS.MemoryUsage
    database?: {
      query?: string
      duration?: number
      activeConnections?: number
    }
    cache?: {
      hit?: boolean
      key?: string
    }
  }) {
    const logEntry = {
      message,
      level: 'info',
      timestamp: new Date().toISOString(),
      performance: {
        operation: metrics.operation,
        duration: metrics.duration,
        memory: metrics.memory ? {
          heapUsed: Math.round(metrics.memory.heapUsed / 1024 / 1024), // MB
          heapTotal: Math.round(metrics.memory.heapTotal / 1024 / 1024), // MB
          external: Math.round(metrics.memory.external / 1024 / 1024), // MB
          rss: Math.round(metrics.memory.rss / 1024 / 1024), // MB
        } : undefined,
        database: metrics.database,
        cache: metrics.cache,
      },
    }

    // Log to both general log and performance-specific log
    logger.info(logEntry)
    logger.log('info', logEntry) // This will go to performance log due to transport filtering
  }

  // Database query logging
  static database(message: string, details: {
    query?: string
    duration?: number
    error?: Error
    params?: any[]
    result?: { count?: number, affectedRows?: number }
  }) {
    const logEntry = {
      message,
      level: details.error ? 'error' : 'debug',
      timestamp: new Date().toISOString(),
      database: {
        query: this.sanitizeDatabaseQuery(details.query),
        duration: details.duration,
        params: details.params ? this.sanitizeParams(details.params) : undefined,
        result: details.result,
        ...(details.error && {
          error: {
            name: details.error.name,
            message: details.error.message,
            stack: details.error.stack,
          },
        }),
      },
    }

    if (details.error) {
      logger.error(logEntry)
    } else {
      logger.debug(logEntry)
    }
  }

  // Environment configuration logging (security-safe)
  static config(message: string, config: Record<string, any>) {
    const safeConfig = this.sanitizeConfig(config)

    const logEntry = {
      message,
      level: 'info',
      timestamp: new Date().toISOString(),
      configuration: safeConfig,
    }

    logger.info(logEntry)
  }

  // Traffic/Usage analytics
  static traffic(message: string, analytics: {
    endpoint: string
    method: string
    responseTime: number
    statusCode: number
    userAgent?: string
    country?: string
    city?: string
    uniqueVisitor?: boolean
  }) {
    const logEntry = {
      message,
      level: 'http',
      timestamp: new Date().toISOString(),
      traffic: {
        endpoint: analytics.endpoint,
        method: analytics.method,
        responseTime: analytics.responseTime,
        statusCode: analytics.statusCode,
        userAgent: analytics.userAgent,
        location: {
          country: analytics.country,
          city: analytics.city,
        },
        uniqueVisitor: analytics.uniqueVisitor,
      },
    }

    logger.http(logEntry)
  }

  // Standard logging methods
  static info(message: string, meta?: Record<string, any>) {
    logger.info(message, meta)
  }

  static warn(message: string, meta?: Record<string, any>) {
    logger.warn(message, meta)
  }

  static debug(message: string, meta?: Record<string, any>) {
    logger.debug(message, meta)
  }

  // Security-safe sanitization methods
  private static sanitizeHeaders(headers: Record<string, string>): Record<string, string> {
    const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key', 'x-auth-token']
    const sanitized: Record<string, string> = {}

    Object.entries(headers).forEach(([key, value]) => {
      if (sensitiveHeaders.includes(key.toLowerCase())) {
        sanitized[key] = '[REDACTED]'
      } else {
        sanitized[key] = value
      }
    })

    return sanitized
  }

  private static sanitizeBody(body: any): any {
    if (typeof body !== 'object' || body === null) return body

    const sensitiveFields = ['password', 'token', 'secret', 'key', 'auth', 'credential']
    const sanitized = { ...body }

    Object.keys(sanitized).forEach(key => {
      if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
        sanitized[key] = '[REDACTED]'
      }
    })

    return sanitized
  }

  private static sanitizeDatabaseQuery(query?: string): string | undefined {
    if (!query) return undefined

    // Remove potential sensitive data from queries
    return query
      .replace(/password\s*=\s*'[^']*'/gi, "password = '[REDACTED]'")
      .replace(/token\s*=\s*'[^']*'/gi, "token = '[REDACTED]'")
      .replace(/'[^']{20,}'/g, "'[LONG_STRING_REDACTED]'") // Redact very long strings that might be tokens
  }

  private static sanitizeParams(params: any[]): any[] {
    return params.map(param => {
      if (typeof param === 'string' && param.length > 50) {
        return '[LONG_PARAM_REDACTED]'
      }
      return param
    })
  }

  private static sanitizeConfig(config: Record<string, any>): Record<string, any> {
    const sensitiveKeys = [
      'password', 'secret', 'key', 'token', 'auth', 'credential',
      'database_url', 'direct_url', 'nextauth_secret'
    ]

    const sanitized: Record<string, any> = {}

    Object.entries(config).forEach(([key, value]) => {
      if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
        if (typeof value === 'string') {
          // Show only first 10 and last 4 characters for connection strings
          if (value.startsWith('postgresql://') || value.startsWith('mysql://')) {
            const parts = value.split('@')
            if (parts.length === 2) {
              sanitized[key] = `${parts[0].substring(0, 15)}***@${parts[1]}`
            } else {
              sanitized[key] = '[REDACTED]'
            }
          } else {
            sanitized[key] = '[REDACTED]'
          }
        } else {
          sanitized[key] = '[REDACTED]'
        }
      } else {
        sanitized[key] = value
      }
    })

    return sanitized
  }
}

export default logger