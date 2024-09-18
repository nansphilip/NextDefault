"use server"

import Prisma from "@lib/prisma"
import { UserDatabase } from "@lib/types"

/**
 * Create a new user in the database
 * @param firstname
 * @param lastname
 * @param email
 * @param password
 * @returns user data from the database
 * @throws Error if unable to create user
 */
export const CreateUser = async ({ firstname, lastname, email, password }: {
    firstname: string,
    lastname: string,
    email: string,
    password: string,
}): Promise<UserDatabase> => {
    try {
        const data = await Prisma.user.create({
            data: {
                firstname: firstname,
                lastname: lastname,
                email,
                password
            }
        })

        // console.log("User create", data)

        return data
    } catch (error) {
        throw new Error("Unable to create user -> " + (error as Error).message)
    }
}

/**
 * Select a user from the database
 * @param email to find user, can be email or new email
 * @returns if user exists return user data, else return null
 * @throws Error if unable to select user
 */
export const SelectUser = async ({ id, email, newEmail }: {
    id?: string,
    email?: string,
    newEmail?: string
}): Promise<UserDatabase | null> => {
    try {
        if (id) return await Prisma.user.findUnique({ where: { id } })
        else if (email) return await Prisma.user.findUnique({ where: { email } })
        else if (newEmail) return await Prisma.user.findUnique({ where: { newEmail } })
        else throw new Error("Invalid parameters to select user")
    } catch (error) {
        throw new Error("Unable to select user -> " + (error as Error).message)
    }
}

/**
 * Update user email verification
 * @param email to find user
 * @param emailVerified
 * @returns updated user data
 * @throws Error if unable to update email verification
 */
export const UpdateUserEmailVerified = async ({ email, emailVerified }: {
    email: string,
    emailVerified: Date
}): Promise<UserDatabase> => {
    try {
        const data = await Prisma.user.update({
            where: { email },
            data: { emailVerified, newEmail: null }
        })

        // console.log("User update email verification", data)

        return data
    } catch (error) {
        throw new Error("Unable to update email verification -> " + (error as Error).message)
    }
}

/**
 * Update user email and new email
 * @param id to find user
 * @param email to update
 * @param newEmail to update
 * @returns updated user data
 * @throws Error if unable to update new email
 */
export const UpdateUserNewEmail = async ({ id, email, newEmail }: {
    id: string,
    email: string,
    newEmail: string | null
}): Promise<UserDatabase> => {
    try {
        const data = await Prisma.user.update({
            where: { id },
            data: { email, newEmail }
        })

        // console.log("User update new email", data)

        return data
    } catch (error) {
        throw new Error("Unable to update new email -> " + (error as Error).message)
    }
}

/**
 * Update user firstname
 * @param email to find user
 * @param firstname
 * @returns updated user data
 * @throws Error if unable to update user name
 */
export const UpdateUserFirstname = async ({ email, firstname }: {
    email: string,
    firstname: string,
}): Promise<UserDatabase> => {
    try {
        const data = await Prisma.user.update({
            where: { email },
            data: { firstname }
        })

        // console.log("User update firstname", data)

        return data
    } catch (error) {
        throw new Error("Unable to update user name -> " + (error as Error).message)
    }
}

/**
 * Update user lastname
 * @param email to find user
 * @param lastname
 * @returns updated user data
 * @throws Error if unable to update user name
 */
export const UpdateUserLastname = async ({ email, lastname }: {
    email: string,
    lastname: string
}): Promise<UserDatabase> => {
    try {
        const data = await Prisma.user.update({
            where: { email },
            data: { lastname }
        })
        // console.log("User update lastname", data)

        return data
    } catch (error) {
        throw new Error("Unable to update user name -> " + (error as Error).message)
    }
}

/**
 * Update user email
 * @param email to find user
 * @param newEmail
 * @returns updated user data
 * @throws Error if unable to update email
 */
export const UpdateUserEmail = async ({ email, newEmail }: {
    email: string,
    newEmail: string
}): Promise<UserDatabase> => {
    try {
        const data = await Prisma.user.update({
            where: { email },
            data: { email: newEmail }
        })

        // console.log("User update email", data)

        return data
    } catch (error) {
        throw new Error("Unable to update email -> " + (error as Error).message)
    }
}

/**
 * Update user password
 * @param email to find user
 * @param newPassword
 * @returns updated user data
 * @throws Error if unable to update password
 */
export const UpdateUserPassword = async ({ email, newPassword }: {
    email: string,
    newPassword: string
}): Promise<UserDatabase> => {
    try {
        const data = await Prisma.user.update({
            where: { email },
            data: { password: newPassword }
        })

        // console.log("User update password", data)

        return data
    } catch (error) {
        throw new Error("Unable to update password -> " + (error as Error).message)
    }
}

/**
 * Delete a user from the database
 * @param id to find user
 * @returns deleted user data
 * @throws Error if unable to delete user
 */
export const DeleteUser = async ({ id }: {
    id: string
}): Promise<UserDatabase> => {
    try {
        const data = await Prisma.user.delete({
            where: { id }
        })

        // console.log("User delete", data)

        return data
    } catch (error) {
        console.error("Delete user error ->", (error as Error).message)
        throw new Error("Unable to delete user -> " + (error as Error).message)
    }
}