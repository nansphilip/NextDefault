import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "@style/globals.css"
import HeaderClient from "@client/client.header"
import { GetSession } from "@cookies/Session"
import ClientCookie from "@client/client.cookie"
import { GetClient } from "@cookies/client"
import ClientContext from "@app/client.context"


const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "Next Ready",
    description: "A next app ready to go.",
}

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {

    // Get the client and create a context
    const client = await GetClient()

    // Get the session
    const session = await GetSession()

    return <html lang="en" className="h-full">
        <ClientCookie client={client} />
        <body className={`flex h-full flex-col overflow-hidden ${inter.className}`}>
            <HeaderClient session={session} />
            <ClientContext client={client}>
                {children}
            </ClientContext>
        </body>
    </html>
}
