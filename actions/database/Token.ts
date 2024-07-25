"use server"

import Prisma from "@lib/Prisma"
import { TokenDatabase } from "@lib/Types"

/**
 * Creates a token
 * @param email - Email to verify
 * @param token - Token to verify
 * @param expires - Expiration date
 * @param type - Type of the token
 * @param clientId - Client ID
 * @returns Created token
 */
export const CreateToken = async ({ email, token, expires, type, clientId }: {
    email?: string,
    token: string,
    expires: Date,
    type: "VERIFY" | "CSRF",
    clientId: string,
}): Promise<TokenDatabase> => {
    try {
        return await Prisma.token.create({
            data: {
                email,
                token,
                expires,
                type,
                clientId
            }
        })
    } catch (error) {
        throw new Error("Unable to create token -> " + (error as Error).message)
    }
}

/**
 * Selects a token
 * @param email - Email to verify
 * @param token - Token to verify
 * @returns Selected token
 */
export const SelectToken = async ({ email, token }: {
    email?: string,
    token?: string,
}): Promise<TokenDatabase | null> => {
    try {
        if (email) return await Prisma.token.findUnique({ where: { email: email } })
        if (token) return await Prisma.token.findUnique({ where: { token: token } })
        return null
    } catch (error) {
        throw new Error("Unable to select verification token -> " + (error as Error).message)
    }
}

/**
 * Selects all tokens
 * @param clientId - Client ID
 * @returns Selected tokens
 */
export const SelectAllTokens = async ({ clientId }: {
    clientId: string
}): Promise<TokenDatabase[] | null> => {
    try {
        return await Prisma.token.findMany({ where: { clientId: clientId } })
    } catch (error) {
        throw new Error("Unable to select all tokens -> " + (error as Error).message)
    }
}

/**
 * Deletes a token
 * @param id - ID of the token
 * @returns Deleted token
 */
export const DeleteToken = async ({ id }: {
    id: string
}): Promise<TokenDatabase> => {
    try {
        return await Prisma.token.delete({
            where: {
                id: id,
            }
        })
    } catch (error) {
        throw new Error("Unable to delete verification token -> " + (error as Error).message)
    }
}

/**
 * Deletes all tokens
 * @param id - ID of the token
 * @returns Deleted tokens
 */
export const DeleteAllTokens = async ({ id }: {
    id: string
}): Promise<any> => {
    try {
        return await Prisma.token.deleteMany({ where: { id: id } })
    } catch (error) {
        throw new Error("Unable to delete all tokens -> " + (error as Error).message)
    }
}

/**
 * Deletes all CSRF tokens
 * @param id - ID of the token
 * @returns Deleted tokens
 */
export const DeleteAllCsrfTokens = async ({ id }: {
    id: string
}): Promise<any> => {
    try {
        return await Prisma.token.deleteMany({ where: { id: id, type: "CSRF" } })
    } catch (error) {
        throw new Error("Unable to delete all CSRF tokens -> " + (error as Error).message)
    }
}