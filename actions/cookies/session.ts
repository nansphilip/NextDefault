"use server"

import { NextRequest } from "next/server"
import { SessionCookieContent, SessionCookies, UpdateSessionContent } from "@lib/Types"
import { CreateCookie, DestroyCookie, GetCookie, RefreshCookie, UpdateCookie } from "@lib/Cookies"

/**
 * Creates a session
 * @param user - User to create the session
 * @returns Created session
 */
export const CreateSession = async (user: SessionCookieContent): Promise<SessionCookies> => {
    try {
        const expires = new Date(Date.now() + 1000 * 60 * 30) // 30 minutes
        const session = await CreateCookie("session", user, expires)
        return session as SessionCookies
    } catch (error) {
        throw new Error("Unable to create session -> " + (error as Error).message)
    }
}

/**
 * Updates a session
 * @param user - User to update the session
 * @returns Updated session
 */
export const UpdateSession = async (user: UpdateSessionContent): Promise<SessionCookies> => {
    try {
        const expires = new Date(Date.now() + 1000 * 60 * 30) // 30 minutes
        const newSession = await UpdateCookie("session", user, expires)
        return newSession as SessionCookies
    } catch (error) {
        throw new Error("Unable to update session -> " + (error as Error).message)
    }
}

/**
 * Refreshes a session
 * @param request - Request object
 * @returns Refreshed session
 */
export const RefreshSession = async (request: NextRequest): Promise<unknown | null> => {
    try {
        const expires = new Date(Date.now() + 1000 * 60 * 30) // 30 minutes
        const response = await RefreshCookie("session", request, expires)
        return response
    } catch (error) {
        throw new Error("Unable to refresh session -> " + (error as Error).message)
    }
}

/**
 * Gets a session
 * @returns Session
 */
export const GetSession = async (): Promise<SessionCookies | null> => {
    try {
        const session = await GetCookie("session")
        return session as SessionCookies | null
    } catch (error) {
        throw new Error("Unable to get session -> " + (error as Error).message)
    }
}

/**
 * Destroys a session
 * @returns Destroyed session
 */
export const DestroySession = async (): Promise<SessionCookies> => {
    try {
        return await DestroyCookie("session") as SessionCookies
    } catch (error) {
        throw new Error("Unable to destroy session -> " + (error as Error).message)
    }
}
