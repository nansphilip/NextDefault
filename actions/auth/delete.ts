"use server"

import { GetSession } from "@cookies/Session"
import { DeleteUser, SelectUser } from "@database/User"
import { ComparePassword } from "@utils/Bcrypt"
import { z } from "zod"
import { ZodTypes, ZodParse } from "@utils/Zod"
import { DeleteAllTokens, SelectAllTokens } from "@database/Token"

/**
 * Deletes a user account
 * @param data - Data to delete the account
 * @returns Deleted account
 */
export const DeleteAccount = async (data: {
    password: string,
    clientId: string
}) => {
    try {
        // Create a ZodTypes schema for delete account
        const deleteSchema = z.object({
            password: ZodTypes.password,
            clientId: ZodTypes.token
        })

        // Destructure the credentials
        const { password, clientId } = await ZodParse({ zodSchema: deleteSchema, dataToParse: data })

        // Get the user email from the session
        const session = await GetSession()
        if (!session) throw new Error("Session not found.")

        // Check if the user exists
        const existingUser = await SelectUser({ email: session.data.email })
        // If the user does not exist, return an error
        if (!existingUser) throw new Error("User not found.")

        // Compare hashed passwords
        const passwordMatch = await ComparePassword({
            password: password,
            hashedPassword: existingUser.password
        })
        // If passwords do not match, return an error
        if (!passwordMatch) return { error: "Invalid password." }

        // Delete user account
        await DeleteUser({ id: session.data.id })

        // Delete every token associated with the client
        const existingOtherToken = await SelectAllTokens({ clientId: clientId })
        if (existingOtherToken) existingOtherToken.map(async (token) => { await DeleteAllTokens({ id: token.id }) })

        return { success: "User account deleted successfully." }
    } catch (error) {
        console.error("Delete account error ->", (error as Error).message)
        return { error: "An unexpected error occurred. Please try again later." }
    }
}