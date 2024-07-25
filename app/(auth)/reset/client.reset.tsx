"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useContext, useEffect, useState } from "react"
import { ResetLink, ResetPassword } from "@auth/Reset"
import FormFeedback from "@server/form-feedback"
import Loader from "@server/loader"
import { FormEvent } from "react"
import CsrfFormClient from "@comps/client/client.csrf"
import { SessionCookies } from "@lib/Types"
import { Context } from "@app/client.context"
import PasswordInputClient from "@comps/client/client.password"
import Button from "@comps/ui/button"

export default function ResetClient({ className, children, session }: {
    className: string,
    children: React.ReactNode,
    session: SessionCookies | null
}) {
    const router = useRouter()

    /**
     * Redirect to dashboard if the user is already logged in
     * It must be encapsulated in a useEffect to avoid instant redirection
     * after the user login action, it's executed once when the component is mounted
     */
    useEffect(() => {
        if (session) router.push("/dashboard")
        // eslint-disable-next-line
    }, [])

    const token = useSearchParams().get('token') ?? null

    const [loading, setLoading] = useState(false)
    const [mode, setMode] = useState<"" | "success" | "danger" | "warning">("")
    const [message, setMessage] = useState("")
    const [disabled, setDisabled] = useState(false)

    const client = useContext(Context)
    if (!client) {
        router.refresh()
        return <></>
    }

    const reset = (e: FormEvent<HTMLFormElement>) => {
        // Prevent the default form submission, and set the loading state
        e.preventDefault()
        setLoading(true)
        setDisabled(true)

        if (!token) {
            const data = {
                email: (e.target as HTMLFormElement)["email"].value,
                clientId: client.data.clientId,
            }

            // Send link
            ResetLink(data).then(({ success, error }) => {
                if (success) {
                    setLoading(false)
                    setMode("success")
                    setMessage(success)

                    // TODO: add button "open messaging"
                }
                if (error) {
                    setLoading(false)
                    setMode("danger")
                    setMessage(error)
                    setDisabled(false)

                    const formEl = e.target as HTMLFormElement
                    formEl.reset()
                }
            })
        } else {
            const data = {
                token: token,
                newPassword: (e.target as HTMLFormElement)["newPassword"].value,
            }

            // Reset password
            ResetPassword(data).then(({ success, error }) => {
                if (success) {
                    setMode("success")
                    setMessage(success)

                    // Todo : send email "Password has been reset"

                    // Redirect to home page
                    setTimeout(() => { router.push("/login") }, 1000)
                }
                if (error) {
                    setLoading(false)
                    setMode("danger")
                    setMessage(error)
                    setDisabled(false)

                    const formEl = e.target as HTMLFormElement
                    formEl.reset()
                }
            })
        }
    }

    return <CsrfFormClient onSubmit={(e) => reset(e)} className={className}>
        {children}
        {token ?
            <>
                <p className="text-center text-xs text-gray-500">Please create a new password.</p>
                <label className="flex w-full flex-col gap-1">
                    New password
                    <PasswordInputClient className="rounded border px-2 outline-none ring-teal-400 ring-offset-2 focus:ring-2" name="newPassword" autoFocus required autoComplete="on" />
                </label>
            </>
            :
            <>
                <p className="text-center text-xs text-gray-500">Provide your email to reset password. You will receive a password reset link.</p>
                <label className="flex w-full flex-col gap-1">
                    Email
                    <input className="rounded border px-2 outline-none ring-teal-400 ring-offset-2 focus:ring-2" name="email" type="email" required autoFocus />
                </label>
            </>
        }
        <Button type="link" variant="link" ring="none"  fontSize="sm" href="/login">Remembered password?</Button>
        <FormFeedback mode={mode}>{message}</FormFeedback>
        <Button type="submit" disabled={disabled} animation={true} ring="none" className="flex items-center justify-center gap-2">{
            loading ?
                <><Loader /><span>Loading...</span></> :
                <>{token ? "Reset" : "Send"}</>
        }</Button>
    </CsrfFormClient>
}