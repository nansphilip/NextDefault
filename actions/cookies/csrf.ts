import { CreateCookie, DestroyCookie, GetCookie, UpdateCookie } from "@lib/Cookies"
import { CsrfCookies } from "@lib/Types"

/**
 * Creates a CSRF cookie
 * @param token - Token to create the CSRF cookie
 * @returns Created CSRF cookie
 */
export const CreateCsrf = async (token: string): Promise<CsrfCookies> => {
    try {
        const content = {
            data: {
                csrf: token
            }
        }
        const expiration = new Date(Date.now() + 1000 * 60 * 5) // 5 minutes
        const cookie = await CreateCookie("csrf", content, expiration)
        return cookie as CsrfCookies
    } catch (error) {
        throw new Error("Unable to create client -> " + (error as Error).message)
    }
}

/**
 * Gets a CSRF cookie
 * @returns CSRF cookie
 */
export const GetCsrf = async (): Promise<CsrfCookies | null> => {
    try {
        const cookie = await GetCookie("csrf") as CsrfCookies | null
        return cookie as CsrfCookies | null
    } catch (error) {
        throw new Error("Unable to get client -> " + (error as Error).message)
    }
}

/**
 * Updates a CSRF cookie
 * @param token - Token to update the CSRF cookie
 * @returns Updated CSRF cookie
 */
export const UpdateCsrf = async (token: string): Promise<CsrfCookies> => {
    try {
        const content = {
            data: {
                csrf: token
            }
        }
        const expiration = new Date(Date.now() + 1000 * 60 * 5) // 5 minutes
        const newCookie = await UpdateCookie("csrf", content, expiration)
        return newCookie as CsrfCookies
    } catch (error) {
        throw new Error("Unable to update session -> " + (error as Error).message)
    }
}

/**
 * Destroys a CSRF cookie
 * @returns Destroyed CSRF cookie
 */
export const DestroyCsrf = async (): Promise<CsrfCookies> => {
    try {
        return await DestroyCookie("csrf") as CsrfCookies
    } catch (error) {
        throw new Error("Unable to destroy CSRF -> " + (error as Error).message)
    }
}
