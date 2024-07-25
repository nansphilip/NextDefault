"use client"

import { CreateClient } from "@cookies/Client"
import { ClientCookies } from "@lib/Types"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

/**
 * This component is used to create a client cookie if it does not exist
 * @returns nothing
 */
export default function ClientCookie({ client }: {
    client: ClientCookies | null
}) {

    const router = useRouter()

    useEffect(() => {
        // If the cookie does not exist, create a new one
        if (!client) CreateClient().then(() => {
            // Refresh the page to make sure the Layout Context Provider has the latest data
            router.refresh()
        })
    }, [client, router])

    return <></>
}