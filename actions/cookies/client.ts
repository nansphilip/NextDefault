"use server"

import { CreateCookie, GetCookie } from "@lib/Cookies"
import { randomBytes } from 'crypto'
import { ClientCookies } from "@lib/Types"

/**
 * Creates a client
 * @returns Created client
 */
export const CreateClient = async (): Promise<ClientCookies> => {
    try {
        const token = randomBytes(32).toString('hex')
        const content = {
            data: {
                clientId: token
            }
        }
        const expiration = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) // 7 days
        const cookie = await CreateCookie("client", content, expiration )
        return cookie as ClientCookies
    } catch (error) {
        throw new Error("Unable to create client -> " + (error as Error).message)
    }
}

/**
 * Gets a client
 * @returns Client
 */
export const GetClient = async (): Promise<ClientCookies | null> => {
    try {
        const cookie = await GetCookie("client") as ClientCookies | null
        return cookie as ClientCookies | null
    } catch (error) {
        throw new Error("Unable to get client -> " + (error as Error).message)
    }
}