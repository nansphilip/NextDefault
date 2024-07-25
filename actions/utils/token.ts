"use server"

import { randomBytes } from 'crypto'
import {
    DeleteToken,
    CreateToken,
    SelectToken
} from "@database/Token"

/**
 * Generates a verification token
 * @param email - Email to verify
 * @param clientId - Client ID
 * @returns Verification token
 */
export async function GenerateVerifyToken(email: string, clientId: string): Promise<string> {
    try {
        // Generate a random token
        const token = randomBytes(32).toString('hex')
        const expires = new Date().getTime() + 1000 * 60 * 60 * 2 // 2 hours

        // Check if the user already has a token
        const isTokenAlreadyUsed = await SelectToken({ token: token })
        // If the user already has a token, delete it
        if (isTokenAlreadyUsed) await DeleteToken({ id: isTokenAlreadyUsed.id })

        // Check if the user already has a token
        const isEmailAlreadyUsed = await SelectToken({ email: email })
        // If the user already has a token, delete it
        if (isEmailAlreadyUsed) await DeleteToken({ id: isEmailAlreadyUsed.id })

        // Create a new token
        const tokenData = await CreateToken({
            email: email,
            token: token,
            expires: new Date(expires),
            type: "VERIFY",
            clientId: clientId
        })

        // Return the created token
        return tokenData.token
    } catch (error) {
        throw new Error("Unable to create verification token -> " + (error as Error).message)
    }
}

/**
 * Generates a CSRF token
 * @param clientId - Client ID
 * @returns CSRF token
 */
export async function GenerateCsrfToken(clientId: string): Promise<string> {
    try {
        // Generate a random token
        const token = randomBytes(32).toString('hex')
        const expires = new Date().getTime() + 1000 * 60 * 5 // 5 minutes

        // Check if the user already has a token
        const isTokenAlreadyUsed = await SelectToken({ token: token })
        // If the user already has a token, delete it
        if (isTokenAlreadyUsed) await DeleteToken({ id: isTokenAlreadyUsed.id })

        // Create a new token
        const tokenData = await CreateToken({
            token: token,
            expires: new Date(expires),
            type: "CSRF",
            clientId: clientId
        })

        // Return the created token
        return tokenData.token
    } catch (error) {
        throw new Error("Unable to create csrf token -> " + (error as Error).message)
    }
}