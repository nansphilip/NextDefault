"use server"

import Prisma from "@lib/prisma"
import { SessionDatabase } from "@lib/types"

/**
 * Creates a session
 * @param clientId - Client ID
 * @param userId - User ID
 * @returns Created session
 */
export const CreateSessionDB = async ({ clientId, userId }: {
    clientId: string,
    userId: string,
}): Promise<SessionDatabase> => {
    try {
        const expires = new Date(Date.now() + 1000 * 60 * 30) // 30 minutes
        return await Prisma.session.create({
            data: {
                clientId,
                userId,
                expires
            }
        })
    } catch (error) {
        throw new Error("Unable to create session -> " + (error as Error).message)
    }
}

/**
 * Selects a session
 * @param id - ID of the session
 * @param userId - User ID
 * @param clientId - Client ID
 * @returns Selected session
 */
export const SelectSessionDB = async ({ id, userId, clientId }: {
    id?: string,
    userId?: string,
    clientId?: string
}): Promise<SessionDatabase | null> => {
    try {
        if (id) return await Prisma.session.findUnique({ where: { id } })
        else if (userId) return await Prisma.session.findFirst({ where: { userId } })
        else if (clientId) return await Prisma.session.findUnique({ where: { clientId } })
        else throw new Error("Invalid parameters to select session")
    } catch (error) {
        throw new Error("Unable to select session -> " + (error as Error).message)
    }
}

/**
 * Selects all sessions
 * @param id - ID of the session
 * @param userId - User ID
 * @param clientId - Client ID
 * @returns Selected sessions
 */
export const SelectAllSessionDB = async ({ id, userId, clientId }: {
    id?: string,
    userId?: string,
    clientId?: string
}): Promise<SessionDatabase[] | null> => {
    try {
        if (id) return await Prisma.session.findMany({ where: { id } })
        else if (userId) return await Prisma.session.findMany({ where: { userId } })
        else if (clientId) return await Prisma.session.findMany({ where: { clientId } })
        else throw new Error("Invalid parameters to select session")
    } catch (error) {
        throw new Error("Unable to select session -> " + (error as Error).message)
    }
}

/**
 * Deletes a session
 * @param id - ID of the session
 * @returns Deleted session
 */
export const DeleteSessionDB = async ({ id }: {
    id: string
}): Promise<SessionDatabase> => {
    try {
        return await Prisma.session.delete({
            where: { id }
        })
    } catch (error) {
        console.error("Delete session error ->", (error as Error).message)
        throw new Error("Unable to delete session -> " + (error as Error).message)
    }
}