import { z, ZodError } from "zod"

/**
 * Password regex 
 * [A-Z] : At least one upper case English letter
 * [a-z] : At least one lower case English letter
 * [0-9] : At least one digit
 * [#?!@$ %^&*-.,:;'"_°] : At least one special character
 * {8,64} : At least 8 characters and at most 64 characters
 */
const passwordRegex: RegExp = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[#?!@$ %^&*-.,:;'"_°]).{8,64}$/

/**
 * ZodTypes constraints list
 */
export const ZodTypes = {
    firstname: z.string().min(0).max(32),
    lastname: z.string().min(0).max(32),
    email: z.string().email().min(5).max(256),
    password: z.string(),
    createPassword: z.string().regex(passwordRegex),
    token: z.string().length(64),
    ip: z.string().ip()
}

/**
 * ZodTypes parser
 * @param zodSchema - ZodTypes object schema
 * @param dataToParse - Data to parse
 * @returns Parsed data
 * @example Example of usage
 * ```ts
 * // Create a credentials object
 * const credentials = { username: "username1234", password: "password1234" }
 * // Create a credentials schema
 * const credentialsSchema = z.object({ username: ZodTypes.username, password: ZodTypes.password })
 * // Parse the credentials
 * const { username, password } = await ZodParse({ zodSchema: credentialsSchema, dataToParse: credentials })
 * ```
 */
export const ZodParse = async ({ zodSchema, dataToParse }: {
    zodSchema: any,
    dataToParse: any
}) => {
    try {
        // Validate the credentials
        return await zodSchema.parseAsync(dataToParse)
    } catch (error) {
        if ((error as ZodError).errors[0].path.includes("newPassword")) throw new Error("PASSWORD_TOO_WEAK")
        //  console.log((error as ZodError).errors)
        throw new Error("ZodTypes parsing error -> " + (error as ZodError).errors[0].path + ": " + (error as ZodError).errors[0].message)
    }
}