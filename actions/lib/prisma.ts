import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
    return new PrismaClient()
}

declare const globalThis: {
    prismaGlobal: ReturnType<typeof prismaClientSingleton>
} & typeof global

/**
 * A singleton instance of the Prisma client to prevent
 * multiple instances of the Prisma client from being created.
 */
const Prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default Prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = Prisma