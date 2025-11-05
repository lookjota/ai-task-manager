import { PrismaClient } from '~/generated/prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'
import { PrismaLibSQL } from '@prisma/adapter-libsql'

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient
}

const prisma = globalForPrisma.prisma || new PrismaClient().$extends(withAccelerate())

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma



const adapter = new PrismaLibSQL({
    url: `${process.env.TURSO_DATABASE_URL}`,
    authToken: `${process.env.TURSO_AUTH_TOKEN}`,
})

export default prisma