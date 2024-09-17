"use client"

import { useSearchParams } from "next/navigation"
import { useContext, useEffect, useRef, useState } from "react"
import { Verify } from "@auth/verify"
import { useRouter } from "next/navigation"
import { CircleCheck, CircleAlert } from "lucide-react"
import { SessionCookies } from "@lib/Types"
import { Context } from "@app/client.context"

export default function VerifyClient({ session }: {
    session: SessionCookies | null,
}) {
    const router = useRouter()

    useEffect(() => {
        // Redirect to dashboard if email is already verified, or if there is no new email to verify
        if (session?.data.emailVerified && !session?.data.newEmail) router.push("/dashboard")
        // eslint-disable-next-line
    }, [])

    const [response, setResponse] = useState("Verifying email...")
    const [color, setColor] = useState("text-black")
    const [icon, setIcon] = useState(<></>)
    const [timer, setTimer] = useState(2)
    const [redirectHidden, setRedirectHidden] = useState(true)

    const emailVerifiedRef = useRef(false)
    const token = useSearchParams().get('token')
    
    const client = useContext(Context)
    
    useEffect(() => {
        // If there is no clientId yet, return
        if (!client) {
            router.refresh()
            return
        }

        // Prevent multiple calls to emailVerification
        if (emailVerifiedRef.current) return
        emailVerifiedRef.current = true

        // Verify email
        if (!token) {
            setResponse("No token provided")
            setIcon(<CircleAlert size={32} />)
            setColor("text-red-500")
            return
        }

        const data = {
            token: token,
            clientId: client.data.clientId,
        }

        Verify(data).then(({ success, error }) => {
            if (success) {
                setResponse("Email confirmed")
                setIcon(<CircleCheck size={32} />)
                setColor("text-green-500")

                // Show redirect message and countdown
                setRedirectHidden(false)
                const interval = setInterval(() => { setTimer((timer) => timer - 1) }, 1000)

                // Redirect to home page
                setTimeout(() => { 
                    router.push("/dashboard") 
                    clearInterval(interval)
                }, 2500)
                return
            }
            if (error) {
                setResponse("Invalid token")
                setIcon(<CircleAlert size={32} />)
                setColor("text-red-500")

                // Todo : add button resend email
                return
            }
        })
    }, [client, token, router])

    return <>
        <h2 className={`flex items-center justify-between gap-2 text-2xl font-bold ${color}`}>{icon}{response}</h2>
        <p hidden={redirectHidden}>Redirecting in {timer}s</p>
    </>
}

