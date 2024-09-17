"use server"

import { Decrypt, Encrypt } from "@utils/jose"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import {
    DataContent,
    DataCookieContent,
    DataCookies,
    UpdateSessionContent,
} from "@lib/types"
import { ResponseCookies } from "next/dist/compiled/@edge-runtime/cookies"

/**
 * Creates a cookie
 * @param name - Name of the cookie
 * @param data - Data to store in the cookie
 * @param expires - Expiration date
 * @returns Created cookie
 */
export const CreateCookie = async (
    name: string,
    data: DataCookieContent,
    expires: Date
): Promise<DataCookies> => {
    try {
        // Check if a cookie already exists
        await DestroyCookie(name)

        // Create the data
        const value = {
            ...data,
            settings: {
                created: new Date(Date.now()),
                updated: new Date(Date.now()),
                expires: expires
            }
        }

        // Encrypt the data
        const encryptedCookie = await Encrypt({ content: value, expiresAt: expires }, expires)

        // Save the session in a time-limited cookie
        cookies().set(name, encryptedCookie, {
            expires: expires,
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            path: "/",
        })

        // Return the data
        return value
    } catch (error) {
        throw new Error("Unable to create cookie -> " + (error as Error).message)
    }
}

/**
 * Updates a cookie
 * @param name - Name of the cookie
 * @param newData - New data to store in the cookie
 * @param expires - Expiration date
 * @returns Updated cookie
 */
export const UpdateCookie = async (
    name: string,
    newData: DataContent | UpdateSessionContent,
    expires: Date
): Promise<DataCookies> => {
    try {
        // Get the current data
        const value = await GetCookie(name)
        if (!value) throw new Error("Cookie not found")

        // Update the data
        const newValue: DataCookies = {
            data: {
                ...value.data,
                ...newData
            },
            settings: {
                created: value.settings.created,
                updated: new Date(Date.now()),
                expires: expires
            }
        }

        // Encrypt the session
        const encryptedCookie = await Encrypt({ content: newValue, expiresAt: expires }, expires)

        // Save the session in a time-limited cookie
        cookies().set("session", encryptedCookie, {
            expires: expires,
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            path: "/",
        })

        // Return the data
        return newValue
    } catch (error) {
        throw new Error("Unable to update cookie -> " + (error as Error).message)
    }
}

/**
 * Refreshes a cookie
 * @param name - Name of the cookie
 * @param request - Request object
 * @param expires - Expiration date
 * @returns Refreshed cookie
 */
export const RefreshCookie = async (
    name: string,
    request: NextRequest,
    expires: Date
): Promise<unknown | null> => {
    try {
        // Get the current encrypted
        const encryptedCookie = request.cookies.get(name)?.value;
        if (!encryptedCookie) return null

        // Decrypt the current data
        const cookie = await Decrypt(encryptedCookie)

        // Get the data
        const value = cookie.content

        // Update the data
        const newValue: DataCookies = {
            data: {
                ...value.data
            },
            settings: {
                created: value.settings.created,
                updated: new Date(Date.now()),
                expires: expires
            }
        }

        // Encrypt the new data
        const newEncryptedCookie = await Encrypt({ content: newValue, expiresAt: expires }, expires)

        // Overwrite the old data with the new one
        const response = NextResponse.next();

        response.cookies.set({
            name: name,
            value: newEncryptedCookie,
            expires: expires,
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            path: "/",
        })

        // Return the updated data
        return response
    } catch (error) {
        throw new Error("Unable to refresh cookie -> " + (error as Error).message)
    }
}

/**
 * Gets a cookie
 * @param name - Name of the cookie
 * @returns Cookie
 */
export const GetCookie = async (name: string): Promise<DataCookies | null> => {
    try {
        // Get the encrypted cookie
        const encryptedCookie = cookies().get(name)?.value
        if (!encryptedCookie) return null

        // Decrypt the data
        const cookie = await Decrypt(encryptedCookie)

        // Return the data
        return cookie.content

    } catch (error) {
        throw new Error("Unable to get cookie -> " + (error as Error).message)
    }
}

/**
 * Destroys a cookie
 * @param name - Name of the cookie
 * @returns Destroyed cookie
 */
export const DestroyCookie = async (name: string): Promise<ResponseCookies | DataCookies> => {
    try {
        // Destroy the cookie
        return cookies().delete(name)
    } catch (error) {
        throw new Error("Unable to destroy cookie -> " + (error as Error).message)
    }
}
