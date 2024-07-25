"use server"

import bcrypt from "bcrypt"

/**
 * Hashes a password
 * @param password
 * @returns hashed password or error message
 */
export const HashPassword = async ({ password }: {
    password: string
}): Promise<string> => {
    try {
        return await bcrypt.hash(password, 10)
    } catch (error) {
        throw new Error("Unable to hash password -> " + (error as Error).message)
    }
}

/**
 * Compares a password with a hashed password
 * @param password
 * @param hashedPassword
 * @returns true if passwords match, false if they don't, or an error message
 */
export const ComparePassword = async ({ password, hashedPassword }: {
    password: string,
    hashedPassword: string
}): Promise<boolean> => {
    try {
        return await bcrypt.compare(password, hashedPassword)
    } catch (error) {
        throw new Error("Unable to compare password -> " + (error as Error).message)
    }
}