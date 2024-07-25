"use client"

import { Context } from "@app/client.context"
import { CreateCsrf, UpdateCsrf } from "@cookies/Csrf"
import { GenerateCsrfToken } from "@utils/Token"
import { useRouter } from "next/navigation"
import { useContext, useEffect } from "react"

export default function CsrfFormClient({ className, children, onSubmit }: {
    className?: string
    children: React.ReactNode
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}) {
    const router = useRouter()
    const client = useContext(Context)

    /**
     * Generate a CSRF token,
     * refresh it every 5 minutes
     */
    useEffect(() => {
        // If there is no clientId yet, return
        if (!client) {
            router.refresh()
            return
        }

        // Prevent multiple requests
        let ignore = false

        // Generate CSRF token on load
        GenerateCsrfToken(client.data.clientId).then(csrfToken => {
            if (!ignore) CreateCsrf(csrfToken).then()
        })

        // Update CSRF token every 5 minutes
        const refreshCSRF = setInterval(() => {
            GenerateCsrfToken(client.data.clientId).then(csrfToken => {
                if (!ignore) UpdateCsrf(csrfToken).then()
            })
        }, 1000 * 60 * 5) // 5 minutes

        // Cleanup
        return () => {
            ignore = true
            clearInterval(refreshCSRF)
        }
        // eslint-disable-next-line
    }, [])

    return <form onSubmit={onSubmit} className={className}>
        {children}
    </form>
}
