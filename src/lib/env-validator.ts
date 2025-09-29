import { Logger } from './logger'

interface EnvConfig {
  name: string
  required: boolean
  type: 'string' | 'number' | 'boolean' | 'url' | 'email'
  description: string
  validation?: (value: string) => boolean
  sensitive: boolean
}

// Environment configuration schema
const ENV_SCHEMA: EnvConfig[] = [
  // Database Configuration
  {
    name: 'DATABASE_URL',
    required: true,
    type: 'url',
    description: 'PostgreSQL connection string for runtime queries',
    validation: (value) => value.startsWith('postgresql://') && value.includes('@'),
    sensitive: true,
  },
  {
    name: 'DIRECT_URL',
    required: true,
    type: 'url',
    description: 'Direct PostgreSQL connection string for migrations',
    validation: (value) => value.startsWith('postgresql://') && value.includes('@'),
    sensitive: true,
  },

  // Supabase Configuration
  {
    name: 'NEXT_PUBLIC_SUPABASE_URL',
    required: true,
    type: 'url',
    description: 'Supabase project URL',
    validation: (value) => value.startsWith('https://') && value.includes('supabase.co'),
    sensitive: false,
  },
  {
    name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    required: true,
    type: 'string',
    description: 'Supabase anonymous public key',
    validation: (value) => value.startsWith('eyJ') && value.length > 100,
    sensitive: true,
  },
  {
    name: 'SUPABASE_SERVICE_ROLE_KEY',
    required: true,
    type: 'string',
    description: 'Supabase service role key for admin operations',
    validation: (value) => value.startsWith('eyJ') && value.length > 100,
    sensitive: true,
  },
  {
    name: 'SUPABASE_STORAGE_BUCKET',
    required: false,
    type: 'string',
    description: 'Supabase storage bucket name',
    sensitive: false,
  },

  // Authentication Configuration
  {
    name: 'NEXTAUTH_SECRET',
    required: true,
    type: 'string',
    description: 'NextAuth.js secret for JWT encryption',
    validation: (value) => value.length >= 32,
    sensitive: true,
  },
  {
    name: 'NEXTAUTH_URL',
    required: true,
    type: 'url',
    description: 'NextAuth.js canonical URL',
    validation: (value) => value.startsWith('http://') || value.startsWith('https://'),
    sensitive: false,
  },

  // Admin Credentials
  {
    name: 'ADMIN_USERNAME',
    required: true,
    type: 'email',
    description: 'Admin panel username/email',
    validation: (value) => value.includes('@') && value.includes('.'),
    sensitive: true,
  },
  {
    name: 'ADMIN_PASSWORD',
    required: true,
    type: 'string',
    description: 'Admin panel password',
    validation: (value) => value.length >= 6,
    sensitive: true,
  },

  // Application Configuration
  {
    name: 'NEXT_PUBLIC_APP_URL',
    required: true,
    type: 'url',
    description: 'Public application URL',
    validation: (value) => value.startsWith('http://') || value.startsWith('https://'),
    sensitive: false,
  },
  {
    name: 'NODE_ENV',
    required: false,
    type: 'string',
    description: 'Node.js environment',
    validation: (value) => ['development', 'production', 'test'].includes(value),
    sensitive: false,
  },

  // Email Configuration (Optional)
  {
    name: 'EMAIL_SERVER_HOST',
    required: false,
    type: 'string',
    description: 'SMTP server hostname',
    sensitive: false,
  },
  {
    name: 'EMAIL_SERVER_PORT',
    required: false,
    type: 'number',
    description: 'SMTP server port',
    validation: (value) => !isNaN(Number(value)) && Number(value) > 0,
    sensitive: false,
  },
  {
    name: 'EMAIL_SERVER_USER',
    required: false,
    type: 'string',
    description: 'SMTP server username',
    sensitive: true,
  },
  {
    name: 'EMAIL_SERVER_PASSWORD',
    required: false,
    type: 'string',
    description: 'SMTP server password',
    sensitive: true,
  },
  {
    name: 'EMAIL_FROM',
    required: false,
    type: 'email',
    description: 'Default sender email address',
    validation: (value) => value.includes('@') && value.includes('.'),
    sensitive: false,
  },
]

interface ValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
  summary: {
    total: number
    required: number
    optional: number
    valid: number
    invalid: number
    missing: number
  }
  configSnapshot: Record<string, string | boolean>
}

export class EnvironmentValidator {
  static validate(): ValidationResult {
    const errors: string[] = []
    const warnings: string[] = []
    const configSnapshot: Record<string, string | boolean> = {}

    let valid = 0
    let invalid = 0
    let missing = 0

    Logger.info('Starting environment validation')

    for (const config of ENV_SCHEMA) {
      const value = process.env[config.name]

      // Create sanitized snapshot
      if (value !== undefined) {
        configSnapshot[config.name] = config.sensitive
          ? this.sanitizeValue(value, config.type)
          : value
      } else {
        configSnapshot[config.name] = false // Missing
      }

      // Check if required environment variable is missing
      if (config.required && !value) {
        missing++
        errors.push(`Missing required environment variable: ${config.name} (${config.description})`)
        Logger.error('Missing required environment variable', undefined, {
          variable: config.name,
          description: config.description,
          required: true,
        })
        continue
      }

      // Skip validation if optional and not provided
      if (!config.required && !value) {
        continue
      }

      // Type validation
      if (value && !this.validateType(value, config.type)) {
        invalid++
        errors.push(`Invalid type for ${config.name}: expected ${config.type}`)
        Logger.error('Environment variable type validation failed', undefined, {
          variable: config.name,
          expectedType: config.type,
          actualValue: config.sensitive ? '[REDACTED]' : value,
        })
        continue
      }

      // Custom validation
      if (value && config.validation && !config.validation(value)) {
        invalid++
        errors.push(`Custom validation failed for ${config.name}: ${config.description}`)
        Logger.error('Environment variable custom validation failed', undefined, {
          variable: config.name,
          description: config.description,
          actualValue: config.sensitive ? '[REDACTED]' : value,
        })
        continue
      }

      // Validation passed
      valid++

      // Security warnings
      if (config.sensitive && value) {
        if (config.name.includes('PASSWORD') && value.length < 8) {
          warnings.push(`Weak password detected for ${config.name} (consider using a stronger password)`)
        }

        if (config.name.includes('SECRET') && value.length < 32) {
          warnings.push(`Short secret detected for ${config.name} (consider using a longer secret)`)
        }

        if (config.type === 'url' && value.startsWith('http://') && config.name.includes('URL')) {
          warnings.push(`Insecure HTTP URL detected for ${config.name} (consider using HTTPS in production)`)
        }
      }
    }

    // Additional environment checks
    this.performAdditionalChecks(warnings, errors)

    const result: ValidationResult = {
      valid: errors.length === 0,
      errors,
      warnings,
      summary: {
        total: ENV_SCHEMA.length,
        required: ENV_SCHEMA.filter(c => c.required).length,
        optional: ENV_SCHEMA.filter(c => !c.required).length,
        valid,
        invalid,
        missing,
      },
      configSnapshot,
    }

    // Log validation summary
    Logger.config('Environment validation completed', {
      validationResult: {
        success: result.valid,
        errorsCount: result.errors.length,
        warningsCount: result.warnings.length,
        summary: result.summary,
      },
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
    })

    return result
  }

  private static validateType(value: string, type: EnvConfig['type']): boolean {
    switch (type) {
      case 'string':
        return typeof value === 'string' && value.length > 0

      case 'number':
        return !isNaN(Number(value)) && isFinite(Number(value))

      case 'boolean':
        return ['true', 'false', '1', '0'].includes(value.toLowerCase())

      case 'url':
        try {
          new URL(value)
          return true
        } catch {
          return false
        }

      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(value)

      default:
        return true
    }
  }

  private static sanitizeValue(value: string, type: EnvConfig['type']): string {
    switch (type) {
      case 'url':
        // For URLs, show protocol and domain, hide credentials
        try {
          const url = new URL(value)
          if (url.password || url.username) {
            return `${url.protocol}//${url.username ? '[USER]' : ''}${url.password ? ':***' : ''}@${url.hostname}:${url.port}${url.pathname}`
          }
          return `${url.protocol}//${url.hostname}${url.pathname}`
        } catch {
          return '[INVALID_URL]'
        }

      case 'email':
        // Show first 2 characters and domain
        const [local, domain] = value.split('@')
        return `${local.substring(0, 2)}***@${domain}`

      default:
        // For other sensitive strings, show first 4 and last 4 characters
        if (value.length <= 8) {
          return '[REDACTED]'
        }
        return `${value.substring(0, 4)}***${value.substring(value.length - 4)}`
    }
  }

  private static performAdditionalChecks(warnings: string[], errors: string[]) {
    // Check for development vs production configuration
    const isProduction = process.env.NODE_ENV === 'production'
    const nextAuthUrl = process.env.NEXTAUTH_URL
    const appUrl = process.env.NEXT_PUBLIC_APP_URL

    if (isProduction) {
      if (nextAuthUrl && nextAuthUrl.includes('localhost')) {
        errors.push('Production environment should not use localhost URLs')
      }

      if (appUrl && appUrl.startsWith('http://')) {
        warnings.push('Production environment should use HTTPS URLs')
      }
    }

    // Database connection string analysis
    const databaseUrl = process.env.DATABASE_URL
    if (databaseUrl) {
      if (!databaseUrl.includes('pooler') && !databaseUrl.includes('pgbouncer')) {
        warnings.push('Database URL appears to be direct connection - consider using connection pooling for better performance')
      }

      if (!databaseUrl.includes('sslmode=require')) {
        warnings.push('Database connection should enforce SSL in production')
      }

      // Check for connection pool parameters
      if (databaseUrl.includes('connection_limit')) {
        const match = databaseUrl.match(/connection_limit=(\d+)/)
        if (match) {
          const limit = parseInt(match[1])
          if (limit > 10) {
            warnings.push(`Connection limit of ${limit} might be too high for Supabase free tier`)
          }
        }
      }
    }

    // Memory and performance warnings
    const memoryUsage = process.memoryUsage()
    Logger.performance('Environment validation memory check', {
      operation: 'env_validation',
      duration: 0,
      memory: memoryUsage,
    })
  }

  // Export configuration for debugging (security-safe)
  static exportSafeConfig(): Record<string, any> {
    const safeConfig: Record<string, any> = {}

    for (const config of ENV_SCHEMA) {
      const value = process.env[config.name]
      if (value) {
        safeConfig[config.name] = {
          set: true,
          type: config.type,
          description: config.description,
          required: config.required,
          value: config.sensitive ? this.sanitizeValue(value, config.type) : value,
        }
      } else {
        safeConfig[config.name] = {
          set: false,
          type: config.type,
          description: config.description,
          required: config.required,
        }
      }
    }

    return safeConfig
  }

  // Validate specific environment variable
  static validateSingle(name: string): { valid: boolean; error?: string; warning?: string } {
    const config = ENV_SCHEMA.find(c => c.name === name)
    if (!config) {
      return { valid: false, error: `Unknown environment variable: ${name}` }
    }

    const value = process.env[name]

    if (config.required && !value) {
      return { valid: false, error: `Missing required environment variable: ${name}` }
    }

    if (value && !this.validateType(value, config.type)) {
      return { valid: false, error: `Invalid type for ${name}: expected ${config.type}` }
    }

    if (value && config.validation && !config.validation(value)) {
      return { valid: false, error: `Custom validation failed for ${name}` }
    }

    return { valid: true }
  }
}

// Initialize environment validation on module load
const validationResult = EnvironmentValidator.validate()

if (!validationResult.valid) {
  Logger.error('Environment validation failed during initialization', undefined, {
    errors: validationResult.errors,
    warnings: validationResult.warnings,
    summary: validationResult.summary,
  })

  // In development, log errors to console for immediate visibility
  if (process.env.NODE_ENV === 'development') {
    console.error('❌ Environment Configuration Errors:')
    validationResult.errors.forEach(error => console.error(`  • ${error}`))

    if (validationResult.warnings.length > 0) {
      console.warn('⚠️  Environment Configuration Warnings:')
      validationResult.warnings.forEach(warning => console.warn(`  • ${warning}`))
    }
  }
}

export default EnvironmentValidator