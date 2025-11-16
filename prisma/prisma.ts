import "dotenv/config";
import { PrismaClient } from '~/generated/prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'
import { PrismaLibSQL } from '@prisma/adapter-libsql'

const globalForPrisma = globalThis as unknown as {
    prisma?: any
}

// Turso is required for production. DATABASE_URL is only for local development with sqlite.
const tursoUrl = process.env.TURSO_DATABASE_URL
const tursoToken = process.env.TURSO_AUTH_TOKEN
const databaseUrl = process.env.DATABASE_URL

// Debug logging to verify environment variables are loaded
console.log('[prisma] Environment check:')
console.log('[prisma]   NODE_ENV:', process.env.NODE_ENV)
console.log('[prisma]   TURSO_DATABASE_URL set:', !!tursoUrl)
console.log('[prisma]   TURSO_AUTH_TOKEN set:', !!tursoToken)
console.log('[prisma]   DATABASE_URL set:', !!databaseUrl)

let prisma: any

// In production, require explicit Turso configuration
if (process.env.NODE_ENV === 'production') {
  if (!tursoUrl || !tursoToken) {
    const errorMsg = 
      'FATAL: Production deployment requires Turso database credentials.\n' +
      'Please set the following environment variables in your hosting platform:\n' +
      '  - TURSO_DATABASE_URL (e.g., libsql://your-db.turso.io)\n' +
      '  - TURSO_AUTH_TOKEN (your Turso auth token)\n' +
      '\nFor Render.com, add these in your service Environment settings.\n' +
      'For other platforms, consult their environment variable documentation.\n' +
      '\nDo not rely on DATABASE_URL (sqlite) for production as it will lose data.'
    console.error('[prisma]', errorMsg)
    throw new Error(errorMsg)
  }
}

// Try to initialize with Turso if credentials are provided
if (tursoUrl && tursoToken) {
  try {
    const adapter = new PrismaLibSQL({
      url: tursoUrl,
      authToken: tursoToken,
    })
    prisma = globalForPrisma.prisma || new PrismaClient({ adapter }).$extends(withAccelerate())
    if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
    console.log('[prisma] Connected to Turso database')
  } catch (err: any) {
    console.error('[prisma] Failed to initialize Turso adapter:', err?.message ?? err)
    throw err
  }
} else if (databaseUrl && process.env.NODE_ENV !== 'production') {
  // In development, allow sqlite fallback via DATABASE_URL
  console.warn('[prisma] Using DATABASE_URL (sqlite) fallback. This is for development only.')
  prisma = globalForPrisma.prisma || new PrismaClient().$extends(withAccelerate())
  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
} else {
  throw new Error(
    '[prisma] No database configured. Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN for production, ' +
    'or DATABASE_URL for local development.'
  )
}

export default prisma