"use server"

import { CreateSession } from "@cookies/session"
import { DeleteAllCsrfTokens, DeleteToken, SelectAllTokens, SelectToken } from "@database/Token"
import { SelectUser } from "@database/User"
import { ComparePassword } from "@utils/bcrypt"
import { z } from "zod"
import { ZodTypes, ZodParse } from "@utils/zod"
import { DestroyCsrf, GetCsrf } from "@cookies/csrf"
import { CreateSessionDB } from "@database/Session"

/**
 * Logs in a user
 * @param data - Data to log in the user
 * @returns Logged in user
 */
export const Login = async (data: {
    email: string,
    password: string,
    clientId: string
}): Promise<{ success?: string, error?: string }> => {

    try {
        // Create a ZodTypes schema for login
        const loginSchema = z.object({
            email: ZodTypes.email,
            password: ZodTypes.password,
            clientId: ZodTypes.token
        })

        // Parse and destructure credentials
        const { email, password, clientId } = await ZodParse({ zodSchema: loginSchema, dataToParse: data })

        // Get CSRF token from cookie
        const csrfCookie = await GetCsrf()
        if (!csrfCookie) throw new Error("CSRF token not found in cookie.")

        // Verified CSRF token
        const existingCsrfToken = await SelectToken({ token: csrfCookie.data.csrf })
        if (!existingCsrfToken) throw new Error("CSRF token not found in database.")

        // Check if CSRF token is expired
        if (existingCsrfToken.expires < new Date()) throw new Error("CSRF token expired.")

        await DestroyCsrf()

        // Check if the user exists
        const existingUser = await SelectUser({ email: email })
        // If the user does not exist, return an error
        if (!existingUser) return { error: "Invalid credentials, or email not verified." }

        // Compare hashed passwords
        const passwordMatch = await ComparePassword({
            password: password,
            hashedPassword: existingUser.password
        })
        // If passwords do not match, return an error
        if (!passwordMatch) return { error: "Invalids credentials, or email not verified." }

        // Create session in database
        await CreateSessionDB({
            clientId: clientId,
            userId: existingUser.id,
        })

        // Create session in cookie
        await CreateSession({
            data: {
                id: existingUser.id,
                firstname: existingUser.firstname,
                lastname: existingUser.lastname,
                email: existingUser.email,
                emailVerified: existingUser.emailVerified,
                newEmail: existingUser.newEmail
            }
        })

        // Delete CSRF token
        await DeleteToken({ id: existingCsrfToken.id })

        // Delete every CSRF token associated with the client
        const existingOtherToken = await SelectAllTokens({ clientId: clientId })
        if (existingOtherToken) existingOtherToken.map(async (token) => { await DeleteAllCsrfTokens({ id: token.id }) })

        // Return success message
        return { success: "Logged in successfully." }

    } catch (error) {
        console.error("Login error ->", (error as Error).message)
        return { error: "An unexpected error occurred. Please try again later." }
    }
}