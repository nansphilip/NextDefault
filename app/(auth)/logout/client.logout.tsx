"use client"

import { DestroySession, GetSession } from "@cookies/Session"
import { DeleteSessionDB, SelectSessionDB } from "@database/Session"
import { SessionCookies, SessionDatabase } from "@lib/types"
import { useRouter } from "next/navigation"
import { useEffect, useRef } from "react"

export default function LogoutClient({ children }: {
    children: React.ReactNode
}) {
    // Initialize router
    const router = useRouter()
    const alreadyLogoutRef = useRef(false)

    useEffect(() => {
        // Prevent multiple calls to emailVerification
        if (alreadyLogoutRef.current) return
        alreadyLogoutRef.current = true

        // Get session from cookies
        GetSession().then((session) => {
            // Get session from database
            SelectSessionDB({ userId: session?.data.id }).then((sessionDB) => {
                // Delete session from database
                DeleteSessionDB({ id: (sessionDB as SessionDatabase).id }).then(() => {
                    // Destroy session from cookie
                    DestroySession().then(() => {
                        router.push("/")
                    })
                })
            })
        })
    }, [])

    return <>{children}</>
}