"use client"

import { ClientCookies } from "@lib/types"
import { createContext } from "react"

export const Context = createContext<ClientCookies | null>(null)

export default function ClientContext({ client, children }: {
    client: ClientCookies | null,
    children: React.ReactNode
}) {

    return <Context.Provider value={client}>
        {children}
    </Context.Provider>
}