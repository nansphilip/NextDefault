import { GetSession, DestroySession } from "@cookies/Session"
import { CircleCheck, CircleAlert } from "lucide-react"
import TimerClient from "@app/(core)/dashboard/client.timer"
import DashboardClient from "@app/(core)/dashboard/client.dashboard"
import { SelectUser } from "@database/User"
import { Suspense } from "react"
import { redirect } from "next/navigation"
import Button from "@comps/ui/button"
import { DeleteSessionDB, SelectAllSessionDB, SelectSessionDB } from "@database/Session"

export default async function DashboardPage() {

    const session = await GetSession()
    // console.log("Current session :", session)

    // const getUserName = async () => {
    //     return await SelectUser({ id: session?.data.id })
    // }

    // return <Suspense fallback={<p>Loading...</p>}>
    //     <DashboardClient promise={getUserName()} />
    // </Suspense>

    return <div className="flex w-[260px] flex-col items-start justify-center gap-2 rounded-xl border p-4 shadow">
        <h2 className="text-2xl font-bold">User</h2>
        <ul className="flex w-full flex-col gap-4">
            <li className="flex flex-col gap-1">
                <p className="text-xs">Name</p>
                <span className="font-semibold">{session?.data.firstname} {session?.data.lastname}</span>
            </li>
            <li className="flex flex-col gap-1">
                <p className="text-xs">Email</p>
                <span className="font-semibold">{session?.data.email}</span>
            </li>
            <li className="flex flex-col gap-1">
                <p className="text-xs">Verified</p>
                <div className={`flex items-center justify-start gap-1 font-semibold` + (session?.data.emailVerified ? ` text-green-500` : ` text-red-500`)}>
                    {session?.data.emailVerified ?
                        <><span>Yes</span><CircleCheck size={16} /></> :
                        <><span>No</span><CircleAlert size={16} /></>
                    }
                </div>
            </li>
            <li>
                <p className="text-xs">Session</p>
                <ul className="flex flex-col gap-2">
                    <li className="flex items-baseline justify-between">
                        <span className="text-sm font-semibold">Created</span>
                        <div className="flex flex-col items-end justify-center">
                            <TimerClient session={session} sessionData="created" className="text-sm" />
                            <TimerClient session={session} sessionData="created" text="ago" className="text-xxs" />
                        </div>
                    </li>
                    <li className="flex items-baseline justify-between">
                        <span className="text-sm font-semibold">Updated</span>
                        <div className="flex flex-col items-end justify-center">
                            <TimerClient session={session} sessionData="updated" className="text-sm" />
                            <TimerClient session={session} sessionData="updated" text="ago" className="text-xxs" />
                        </div>
                    </li>
                    <li className="flex items-baseline justify-between">
                        <span className="text-sm font-semibold">Expires</span>
                        <div className="flex flex-col items-end justify-center">
                            <TimerClient session={session} sessionData="expires" className="text-sm" />
                            <TimerClient session={session} sessionData="expires" text="left" className="text-xxs" />
                        </div>
                    </li>
                </ul>
            </li>
        </ul>
        <Button type="link" href="/logout" variant="outline">Logout</Button>
    </div>
}