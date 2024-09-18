import { GetSession } from "@cookies/session"
import { redirect } from "next/navigation"
import CenterStartLayoutClient from "@client/client.center-start-layout";

export default async function CoreLayout({ children }: { children: React.ReactNode }) {

    const session = await GetSession()
    if (!session) redirect("/login")

    return <CenterStartLayoutClient className="flex flex-1 flex-col items-center gap-2 overflow-y-auto overflow-x-hidden p-4">
        {children}
    </CenterStartLayoutClient>
}