"use client"

import { UserDatabase } from "@lib/types"
import { use } from "react"

export default function DashboardClient({ promise }: {
    promise: Promise<UserDatabase | null>
}) {

    const data = use(promise)

    return <div>
        {data?.firstname ?? "User does not exist."}
    </div>
}