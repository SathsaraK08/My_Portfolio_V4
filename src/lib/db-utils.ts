import { prisma } from './prisma'

// Database utility with retry logic for connection failures
export async function withDatabaseRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error as Error

      // Check if it's a connection error
      if (
        error instanceof Error &&
        (error.message.includes('connection') ||
         error.message.includes('Connection') ||
         error.message.includes('ECONNRESET') ||
         error.message.includes('pool'))
      ) {
        console.log(`Database connection attempt ${attempt} failed, retrying...`)

        // Wait before retrying (exponential backoff)
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, delayMs * attempt))
          continue
        }
      }

      // If it's not a connection error or we've exhausted retries, throw
      throw error
    }
  }

  throw lastError!
}

// Health check function
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`
    return true
  } catch (error) {
    console.error('Database health check failed:', error)
    return false
  }
}