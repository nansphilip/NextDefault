"use client"

import { Login } from "@auth/login"
import { FormEvent, useContext, useEffect, useState } from "react"
import Loader from "@server/loader"
import FormFeedback from "@server/form-feedback"
import { useRouter } from "next/navigation"
import { SessionCookies } from "@lib/Types"
import CsrfFormClient from "@comps/client/client.csrf"
import { Context } from "@app/client.context"
import Button from "@comps/ui/button"

export default function LoginClient({ session, className, children }: {
    session: SessionCookies | null,
    className: string,
    children: React.ReactNode,
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

    const [loading, setLoading] = useState(false)
    const [mode, setMode] = useState<"" | "success" | "danger" | "warning">("")
    const [message, setMessage] = useState("")
    const [disabled, setDisabled] = useState(false)

    const client = useContext(Context)
    if (!client) {
        router.refresh()
        return <></>
    }

    const signIn = (e: FormEvent<HTMLFormElement>) => {

        // Prevent the default form submission, and set the loading state
        e.preventDefault()
        setLoading(true)
        setDisabled(true)

        // Call the login function
        const data = {
            email: (e.target as HTMLFormElement)["email"].value,
            password: (e.target as HTMLFormElement)["password"].value,
            clientId: client.data.clientId
        }

        Login(data).then(({ success, error }) => {
            if (success) {
                setMode("success")
                setMessage(success)

                // Redirect to home page
                setTimeout(() => { router.push("/dashboard") }, 1000)
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

    return <CsrfFormClient className={className} onSubmit={(e) => signIn(e)}>
        {children}
        <FormFeedback mode={mode}>{message}</FormFeedback>
        <Button type="submit" disabled={disabled} animation={true} ring="none" className="flex items-center justify-center gap-2">{
            loading ?
                <><Loader /><span>Loading...</span></> :
                "Login"
        }</Button>
    </CsrfFormClient>
}