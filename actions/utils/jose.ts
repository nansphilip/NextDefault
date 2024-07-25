"use server"

import { SignJWT, jwtVerify } from "jose"

// Must be a string with at least 256 bits (32 characters)
const encodedKey = new TextEncoder().encode(process.env.SESSION_SECRET)

/**
 * Encrypts the payload
 * @param payload - Payload to Encrypt
 * @param expiration - Expiration date
 * @returns Encrypted payload
 */
export const Encrypt = async (payload: any, expiration: Date): Promise<string> => {
    try {
        const token = await new SignJWT(payload)
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime(expiration)
            .sign(encodedKey)

        return token
    } catch (error) {
        throw new Error("Unable to Encrypt payload -> " + (error as Error).message)
    }
}

/**
 * Decrypts the payload
 * @param input - Input to Decrypt
 * @returns Decrypted payload
 */
export const Decrypt = async (input: string): Promise<any> => {
    try {
        const { payload } = await jwtVerify(input, encodedKey, {
            algorithms: ["HS256"],
        })
        return payload
    } catch (error) {
        // if ((error as JOSEError).code === "ERR_JWT_EXPIRED") throw new Error("Token expired")
        throw new Error("Unable to Decrypt payload -> " + (error as Error).message)
    }
}