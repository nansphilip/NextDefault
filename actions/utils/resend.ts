"use server"

import { ErrorResponse, Resend } from 'resend'

const ResendAPI = new Resend(process.env.RESEND_API_KEY)

// Set the domain for the verification link
const domain = process.env.NODE_ENV !== 'production' ?
    `http://localhost:3000` :
    process.env.RESEND_DOMAIN as string

const emailSender = process.env.NODE_ENV !== 'production' ?
    `onboarding@resend.dev` :
    process.env.RESEND_EMAIL as string

/**
 * @augments email of the recipient
 * @augments subject of the email
 * @augments body of the email
 * @var `{domain.com}` into `body`, is a string witch will be replaced by the `domain.com` or `localhost:3000`
 * @example ```tsx
 * await SendEmail({
 *     email: email,
 *     subject: 'Validate your email address',
 *     body: `<p>Please confirm your email by clicking this link: <a href={domain.com}/verify?token=${generatedToken}>confirm my email</a></p>`
 * })
 * ```
 * @returns the email id of the sent email
 * @throws an error if the email could not be sent
 */
export async function SendEmail({ email, subject, body }: {
    email: string,
    subject: string,
    body: string
}) {
    try {
        // Replace all {domain.com} with the correct `domain.com` or `localhost:3000`
        const replaceDomain = (mail: string): string => {
            if (mail.includes("{domain.com}")) {
                const newBody = mail.replace("{domain.com}", domain)
                return replaceDomain(newBody)
            }
            return mail
        }

        const bodyEmail = replaceDomain(body)

        // Send the email
        const { data } = await ResendAPI.emails.send({
            from: emailSender,
            to: email,
            subject: subject,
            html: bodyEmail
        })

        return data
    } catch (error) {
        throw new Error("Unable to send email -> " + (error as ErrorResponse).message)
    }
}