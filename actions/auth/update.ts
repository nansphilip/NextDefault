"use server"

import { SelectUser, UpdateUserPassword, UpdateUserFirstname, UpdateUserLastname, UpdateUserNewEmail } from "@database/User"
import { ComparePassword, HashPassword } from "@utils/bcrypt"
import { GetSession, UpdateSession } from "@cookies/session"
import { GenerateVerifyToken } from "@utils/token"
import { SendEmail } from "@utils/resend"
import { z } from "zod"
import { ZodTypes, ZodParse } from "@utils/zod"

/**
 * Updates the name of a user
 * @param data - Data to update the name
 * @returns Updated name
 */
export const UpdateName = async (data: {
    firstname: string,
    lastname: string,
    password: string
}) => {
    try {
        // Create a ZodTypes schema
        const updateSchema = z.object({
            firstname: ZodTypes.firstname,
            lastname: ZodTypes.lastname,
            password: ZodTypes.password,
        })

        // Destructure the credentials
        const { firstname, lastname, password } = await ZodParse({ zodSchema: updateSchema, dataToParse: data })

        // Get the session
        const session = await GetSession()
        if (!session) throw new Error("User not authenticated.")

        // Get the existing user
        const existingUser = await SelectUser({ email: session.data.email })
        if (!existingUser) throw new Error("User not found.")

        // Check password
        const passwordMatch = await ComparePassword({
            password,
            hashedPassword: existingUser.password
        })
        if (!passwordMatch) return { error: "Invalid password." }

        if (firstname) await UpdateUserFirstname({ email: session.data.email, firstname })
        if (lastname) await UpdateUserLastname({ email: session.data.email, lastname })

        await UpdateSession({
            firstname: firstname ? firstname : session.data.firstname,
            lastname: lastname ? lastname : session.data.lastname
        })

        // Return success message
        return { success: "User name updated successfully." }
    } catch (error) {
        console.error("Update name error ->", (error as Error).message)
        return { error: "An unexpected error occurred. Please try again later." }
    }
}

/**
 * Updates the email of a user
 * @param data - Data to update the email
 * @returns Updated email
 */
export const UpdateEmail = async (data: {
    newEmail: string,
    password: string,
    clientId: string
}) => {
    try {
        // Create a ZodTypes schema
        const updateSchema = z.object({
            newEmail: ZodTypes.email,
            password: ZodTypes.password,
            clientId: ZodTypes.token
        })

        // Destructure the credentials
        const { newEmail, password, clientId } = await ZodParse({ zodSchema: updateSchema, dataToParse: data })

        // Get the session
        const session = await GetSession()
        if (!session) throw new Error("User not authenticated.")

        // Get the existing user
        const existingUser = await SelectUser({ email: session.data.email })
        if (!existingUser) throw new Error("User not found.")

        // Check password
        const passwordMatch = await ComparePassword({
            password,
            hashedPassword: existingUser.password
        })
        if (!passwordMatch) return { error: "Invalid password." }

        // Update user new email
        const updatedUser = await UpdateUserNewEmail({
            id: existingUser.id,
            email: session.data.email,
            newEmail: newEmail
        })

        // Update the session
        await UpdateSession({
            newEmail: updatedUser.newEmail
        })

        // Generate a verification token
        const generatedToken = await GenerateVerifyToken(newEmail, clientId)

        // Send the verification email
        await SendEmail({
            email: newEmail,
            subject: 'Validate your new email address',
            body: `<p>Please confirm your new email by clicking this link: <a href={domain.com}/verify?token=${generatedToken}>confirm my new email</a>.</p>`
        })

        // Return success message
        return { success: "An email has been set, please confirm your new address." }
    } catch (error) {
        console.error("Update email error ->", (error as Error).message)
        return { error: "An unexpected error occurred. Please try again later." }
    }
}

/**
 * Updates the password of a user
 * @param data - Data to update the password
 * @returns Updated password
 */
export const UpdatePassword = async (data: {
    password: string,
    newPassword: string,
}) => {
    try {
        // Create a ZodTypes schema
        const updateSchema = z.object({
            password: ZodTypes.password,
            newPassword: ZodTypes.createPassword,
        })

        // Destructure the credentials
        const { password, newPassword } = await ZodParse({ zodSchema: updateSchema, dataToParse: data })

        const session = await GetSession()
        if (!session) throw new Error("User not authenticated.")

        const existingUser = await SelectUser({ email: session.data.email })
        if (!existingUser) throw new Error("User not found.")

        // Compare hashed passwords
        const passwordMatch = await ComparePassword({
            password: password,
            hashedPassword: existingUser.password
        })
        // If passwords do not match, return an error
        if (!passwordMatch) return { error: "Invalid password." }

        // Update the password
        const hashedPassword = await HashPassword({ password: newPassword })

        // Update the user password
        await UpdateUserPassword({ email: session.data.email, newPassword: hashedPassword })

        // Todo : disconnect all devices

        // Return success message
        return { success: "User password updated successfully." }
    } catch (error) {
        if ((error as Error).message === "PASSWORD_TOO_WEAK") return { error: "New password isn't strong enough." }

        console.error("Update password error ->", (error as Error).message)
        return { error: "An unexpected error occurred. Please try again later." }
    }
}

/**
 * Resends an email
 * @param name - Name of the email
 * @param clientId - Client ID
 * @returns Resended email
 */
export const ResendEmail = async (
    name: string,
    clientId: string
) => {
    try {
        // Get the session
        const session = await GetSession()
        if (!session) throw new Error("User not authenticated.")

        // Get the email
        const email = name === "notVerifiedEmail" ?
            session.data.email :
            session.data.newEmail as string

        // Generate a verification token
        const generatedToken = await GenerateVerifyToken(email, clientId)

        // Send the verification email
        await SendEmail({
            email: email,
            subject: name === "notVerifiedEmail" ?
                'Validate your email address' :
                'Validate your new email address',
            body: name === "notVerifiedEmail" ?
                `<p>Please confirm your email by clicking this link: <a href={domain.com}/verify?token=${generatedToken}>confirm my email</a>.</p>` :
                `<p>Please confirm your new email by clicking this link: <a href={domain.com}/verify?token=${generatedToken}>confirm my new email</a>.</p>`
        })

        return { success: "Sent!" }
    } catch (error) {
        console.error("Resend email error ->", (error as Error).message)
        return { error: "Retry later..." }
    }
}