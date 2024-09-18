"use server"

import { SelectUser, UpdateUserEmailVerified } from "@database/User"
import { DeleteToken, SelectToken } from "@database/Token"
import { GetSession, UpdateSession } from "@cookies/session"
import { GenerateVerifyToken } from "@utils/token"
import { SendEmail } from "@utils/resend"
import { z } from "zod"
import { ZodTypes, ZodParse } from "@utils/zod"
import { ZodTypes, ZodParse } from "@utils/zod"

/**
 * Verifies an email
 * @param data - Data to verify the email
 * @returns Verified email
 */
export const Verify = async (data: {
    token: string,
    clientId: string
}): Promise<{ success?: string, error?: string }> => {
    try {
        // Create a ZodTypes schema
        const verifySchema = z.object({
            token: ZodTypes.token,
            clientId: ZodTypes.token
        })

        // Parse token
        const { token, clientId } = await ZodParse({ zodSchema: verifySchema, dataToParse: data })

        // Verify the token exists
        const existingToken = await SelectToken({ token: token })
        // If token does not exist, return error
        if (!existingToken || !existingToken.email) return { error: "Token is not valid." }

        // Check if the token has expired
        const hasExpired = new Date(existingToken.expires) > new Date()
        // If token has expired, send a new email token and return error
        if (!hasExpired) {
            // Generate a verification token
            const generatedToken = await GenerateVerifyToken(existingToken?.email, clientId)

            // Send the verification email
            await SendEmail({
                email: existingToken?.email,
                subject: 'Validate your email address',
                body: `<p>Please confirm your email by clicking this link: <a href={domain.com}/verify?token=${generatedToken}>confirm my email</a>.</p>`
            })

            return { error: "Token has expired." }
        }

        // Verify the user exists
        const existingUser =
            await SelectUser({ email: existingToken.email }) ??
            await SelectUser({ newEmail: existingToken.email })
        // If user does not exist, return error
        if (!existingUser) throw new Error("User does not exists.")

        // Check if token email matches user email or new email
        if (existingToken.email !== existingUser.email && existingToken.email !== existingUser.newEmail)
            throw new Error("Token email does not match user email.")

        // Update the user's email verification status
        const updatedUser = await UpdateUserEmailVerified({
            email: existingUser.newEmail ?? existingToken.email,
            emailVerified: new Date()
        })

        // Get session
        const session = await GetSession()

        // If session exists, update it
        if (session) {
            await UpdateSession({
                email: updatedUser.email,
                emailVerified: updatedUser.emailVerified,
                newEmail: updatedUser.newEmail
            })
        }

        // Delete the verification token
        await DeleteToken({ id: existingToken.id })

        // Return success message
        return { success: "Email verified successfully" }

    } catch (error) {
        console.error("Verify error ->", (error as Error).message)
        return { error: "An error occurred while verifying the email" }
    }
}
