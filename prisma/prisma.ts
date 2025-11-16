import "dotenv/config";
import { PrismaClient } from '~/generated/prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'
import { PrismaLibSQL } from '@prisma/adapter-libsql'

const globalForPrisma = globalThis as unknown as {
    prisma?: any
}

// Prefer explicit TURSO_* env vars (used in production), otherwise fall back to DATABASE_URL
// This prevents startup crashes when a hosting platform hasn't set secrets.
const tursoUrl = process.env.TURSO_DATABASE_URL ?? process.env.DATABASE_URL
const tursoToken = process.env.TURSO_AUTH_TOKEN

let prisma: any

if (tursoUrl && tursoToken) {
    // If both Turso URL and token exist, use the LibSQL adapter
    try {
        const adapter = new PrismaLibSQL({
            url: tursoUrl,
            authToken: tursoToken,
        })

        prisma = globalForPrisma.prisma || new PrismaClient({ adapter }).$extends(withAccelerate())
        if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
    } catch (err: any) {
        // If adapter construction fails, surface a clear error (but don't leave an undefined prisma)
        console.error('[prisma] Failed to initialize Prisma LibSQL adapter:', err?.message ?? err)
        console.error('[prisma] Falling back to default Prisma client using DATABASE_URL if available.')
        prisma = globalForPrisma.prisma || new PrismaClient().$extends(withAccelerate())
        if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
    }
} else if (process.env.DATABASE_URL) {
    // No Turso credentials — use DATABASE_URL (e.g. local sqlite) so app can start
    console.warn('[prisma] TURSO_DATABASE_URL or TURSO_AUTH_TOKEN not set. Using DATABASE_URL fallback.')
    prisma = globalForPrisma.prisma || new PrismaClient().$extends(withAccelerate())
    if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
} else {
    // Neither TURSO nor DATABASE_URL provided — log an explicit error and create a Prisma client
    // This avoids an immediate crash with a vague 'undefined' error and provides actionable logs.
    console.error('[prisma] No database configuration detected. Please set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN, or DATABASE_URL for sqlite.')
    prisma = globalForPrisma.prisma || new PrismaClient().$extends(withAccelerate())
    if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
}

export default prisma