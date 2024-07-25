"use server"

import { DeleteAllCsrfTokens, DeleteToken, SelectAllTokens, SelectToken } from "@database/Token"
import { SelectUser, UpdateUserPassword } from "@database/User"
import { HashPassword } from "@utils/Bcrypt"
import { SendEmail } from "@utils/Resend"
import { GenerateVerifyToken } from "@utils/Token"
import { z } from "zod"
import { ZodTypes, ZodParse } from "@utils/Zod"
import { DestroyCsrf, GetCsrf } from "@cookies/Csrf"

/**
 * Sends a reset link
 * @param data - Data to send the reset link
 * @returns Sent reset link
 */
export const ResetLink = async (data: {
    email: string,
    clientId: string
}): Promise<{ success?: string, error?: string }> => {

    try {
        // Create a ZodTypes schema for reset link
        const resetSchema = z.object({
            email: ZodTypes.email,
            clientId: ZodTypes.token
        })

        // Destructure the credentials
        const { email, clientId } = await ZodParse({ zodSchema: resetSchema, dataToParse: data })

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
        if (!existingUser) return { success: "If an account with this email exists, an email has been sent to reset your password." }

        // Generate a verification token
        const generatedToken = await GenerateVerifyToken(existingUser.email, clientId)

        // Send the verification email
        await SendEmail({
            email: existingUser.email,
            subject: 'Reset your password',
            body: `<p>Please reset your password by clicking this link: <a href={domain.com}/reset?token=${generatedToken}>reset my password</a>.</p>`
        })

        // Delete CSRF token
        await DeleteToken({ id: existingCsrfToken.id })

        // Delete every CSRF token associated with the client
        const existingOtherToken = await SelectAllTokens({ clientId: clientId })
        if (existingOtherToken) existingOtherToken.map(async (token) => { await DeleteAllCsrfTokens({ id: token.id }) })

        // Return success message
        return { success: "If an account with this email exists, an email has been sent to reset your password." }

    } catch (error) {
        console.log(error)
        console.error("Reset link error ->", (error as Error).message)
        return { error: "An unexpected error occurred. Please try again later." }
    }
}

/**
 * Resets the password of a user
 * @param data - Data to reset the password
 * @returns Reset password
 */
export const ResetPassword = async (data: {
    token: string,
    newPassword: string,
}): Promise<{ success?: string, error?: string }> => {

    try {
        // Create a ZodTypes schema for login
        const resetSchema = z.object({
            token: ZodTypes.token,
            newPassword: ZodTypes.createPassword,
        })

        // Destructure the credentials
        const { token, newPassword } = await ZodParse({ zodSchema: resetSchema, dataToParse: data })

        // Get CSRF token from cookie
        const csrfCookie = await GetCsrf()
        if (!csrfCookie) throw new Error("CSRF token not found in cookie.")

        // Verified CSRF token
        const existingCsrfToken = await SelectToken({ token: csrfCookie.data.csrf })
        if (!existingCsrfToken) throw new Error("CSRF token not found in database.")

        // Check if CSRF token is expired
        if (existingCsrfToken.expires < new Date()) throw new Error("CSRF token expired.")

        await DestroyCsrf()

        // Hash the password
        const hashedPassword = await HashPassword({ password: newPassword })

        // Verify the token exists
        const existingToken = await SelectToken({ token: token })
        // If token does not exist, return error
        if (!existingToken || !existingToken.email) return { error: "Token is not valid." }

        // Check if the token has expired
        const hasExpired = new Date(existingToken.expires) > new Date()
        // If token has expired, return error
        if (!hasExpired) return { error: "Token has expired." }

        // Verify the user exists
        const existingUser = await SelectUser({ email: existingToken.email })
        // If user does not exist, return error
        if (!existingUser) throw new Error("User does not exists.")

        // Update the user password
        await UpdateUserPassword({ email: existingUser.email, newPassword: hashedPassword })

        // Delete the verification token
        await DeleteToken({ id: existingToken.id })

        // Delete CSRF token
        await DeleteToken({ id: existingCsrfToken.id })

        return { success: "Your password has been updated." }
    } catch (error) {
        if ((error as Error).message === "PASSWORD_TOO_WEAK") return { error: "New password isn't strong enough." }

        console.error("Reset password error ->", (error as Error).message)
        return { error: "An unexpected error occurred. Please try again later." }
    }
}

