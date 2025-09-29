import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'warn', 'error'] : ['warn', 'error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    // Optimize for connection pooling and performance
    errorFormat: 'minimal',
    transactionOptions: {
      timeout: 30000, // 30 seconds
    },
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Enhanced connection monitoring
export async function checkPrismaConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`
    return true
  } catch (error) {
    console.error('Prisma connection check failed:', error)
    return false
  }
}

// Connection pool health metrics
export async function getConnectionPoolInfo() {
  try {
    const result = await prisma.$queryRaw<Array<{ count: number }>>`
      SELECT count(*) as count FROM pg_stat_activity WHERE state = 'active'
    `
    return { activeConnections: result[0]?.count || 0 }
  } catch (error) {
    console.error('Failed to get connection pool info:', error)
    return { activeConnections: -1 }
  }
}

// Graceful shutdown with timeout
process.on('beforeExit', async () => {
  try {
    await Promise.race([
      prisma.$disconnect(),
      new Promise(resolve => setTimeout(resolve, 5000))
    ])
  } catch (error) {
    console.error('Error during Prisma disconnect:', error)
  }
})
