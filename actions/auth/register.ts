"use server"

import { GenerateVerifyToken } from "@utils/token"
import { SendEmail } from "@utils/resend"
import { GenerateVerifyToken } from "@utils/token"
import { SendEmail } from "@utils/resend"
import { CreateUser, SelectUser } from "@database/User"
import { HashPassword } from "@utils/bcrypt"
import { CreateSession } from "@cookies/session"
import { z } from "zod"
import { ZodTypes, ZodParse } from "@utils/zod"
import { ZodTypes, ZodParse } from "@utils/zod"
import { DeleteAllCsrfTokens, DeleteToken, SelectAllTokens, SelectToken } from "@database/Token"
import { DestroyCsrf, GetCsrf } from "@cookies/csrf"
import { DestroyCsrf, GetCsrf } from "@cookies/csrf"
import { CreateSessionDB } from "@database/Session"

/**
 * Registers a user
 * @param data - Data to register the user
 * @returns Registered user
 */
export const Register = async (data: {
    firstname: string,
    lastname: string,
    email: string,
    newPassword: string,
    clientId: string
}): Promise<{ success?: string, error?: string }> => {

    try {
        // Create a ZodTypes schema for login
        const registerSchema = z.object({
            firstname: ZodTypes.firstname,
            lastname: ZodTypes.lastname,
            email: ZodTypes.email,
            newPassword: ZodTypes.createPassword,
            clientId: ZodTypes.token
        })

        // Destructure the credentials
        const { firstname, lastname, email, newPassword, clientId } = await ZodParse({ zodSchema: registerSchema, dataToParse: data })

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

        // Check if the user already exists
        const existingUser = await SelectUser({ email: email })

        // If the user already exists
        if (existingUser) {
            // Send email "Your account already exists
            await SendEmail({
                email: email,
                subject: 'Your account already exists',
                body: `<p>Please <a href={domain.com}/login>login</a> or <a href={domain.com}/reset>reset your password</a>.</p>`
            })

        } else {
            // Create the user
            const createdUser = await CreateUser({
                firstname: firstname,
                lastname: lastname,
                email: email.toLowerCase(),
                password: hashedPassword,
            })


            // Generate a verification token
            const generatedToken = await GenerateVerifyToken(email, clientId)

            // Send the verification email
            await SendEmail({
                email: email,
                subject: 'Validate your email address',
                body: `<p>Please confirm your email by clicking this link: <a href={domain.com}/verify?token=${generatedToken}>confirm my email</a>.</p>`
            })

            // Create session in database
            await CreateSessionDB({
                clientId: clientId,
                userId: createdUser.id,
            })

            // Create session in cookie
            await CreateSession({
                data: {
                    id: createdUser.id,
                    firstname: createdUser.firstname,
                    lastname: createdUser.lastname,
                    email: createdUser.email,
                    emailVerified: createdUser.emailVerified,
                    newEmail: createdUser.newEmail
                }
            })
        }

        // Delete current CSRF token
        await DeleteToken({ id: existingCsrfToken.id })

        // Delete every CSRF token associated with the client
        const existingOtherToken = await SelectAllTokens({ clientId: clientId })
        if (existingOtherToken) existingOtherToken.map(async (token) => { await DeleteAllCsrfTokens({ id: token.id }) })

        // Return success message
        return { success: "User registered successfully. An email was sent, please confirm your address." }

    } catch (error) {
        if ((error as Error).message === "PASSWORD_TOO_WEAK") return { error: "New password isn't strong enough." }

        console.error("Register error ->", (error as Error).message)
        return { error: "An unexpected error occurred. Please try again later." }
    }
}
