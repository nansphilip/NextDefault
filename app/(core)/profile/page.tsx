import { GetSession } from "@cookies/session"
import ProfileClient from "@app/(core)/profile/client.profile"
import ResendButtonClient from "@app/(core)/profile/client.resend"
import { CircleCheck, CircleAlert, KeyRound } from "lucide-react"
import { SelectAllSessionDB } from "@database/Session"
import { GetClient } from "@cookies/client"
import { redirect } from "next/navigation"

export default async function ProfilePage() {

    const client = await GetClient()
    const session = await GetSession()

    const sessionDB = await SelectAllSessionDB({ userId: session?.data.id })
    if (!sessionDB) redirect("/logout")

    const currentSession = sessionDB.find((session) => session.clientId === client?.data.clientId)
    const otherSession = sessionDB?.filter((session) => session.clientId !== client?.data.clientId)

    return <div className="flex w-[260px] flex-col gap-4">
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border p-4 shadow">
            <h2 className="text-2xl font-bold">Sessions</h2>
            <p className="text-center text-xs text-gray-500">Manage sessions across devices.</p>

            <ul className="flex w-full flex-col items-center justify-start gap-2">
                {/* Current session */}
                <div className="flex w-full flex-col items-center justify-start gap-2">
                    <div className="flex w-full items-center justify-start gap-2">
                        <span className="text-xs font-semibold italic text-gray-600">Current session</span>
                        <KeyRound size={12} className="text-green-500" />
                    </div>
                    <li className="text-xxs w-full truncate text-gray-400">{currentSession?.clientId}</li>
                </div>

                {/* Other sessions */}
                <div className="flex w-full flex-col items-center justify-start gap-2">
                    <div className="flex w-full items-center justify-start gap-2">
                        <span className="text-xs font-semibold italic text-gray-600">Other sessions</span>
                        <KeyRound size={12} className="text-orange-500" />
                    </div>
                    {otherSession.length ?
                        otherSession.map((session) => <li className="text-xxs w-full truncate text-gray-400" key={session.clientId}>{session.clientId}</li>) :
                        <li className="text-xxs w-full truncate text-center text-gray-400">No other sessions.</li>
                    }
                </div>
            </ul>
        </div>

        <ProfileClient action="UpdateName" className="flex flex-col items-center justify-center gap-2 rounded-xl border p-4 shadow">
            <h2 className="text-2xl font-bold">Information</h2>
            <p className="text-center text-xs text-gray-500">Update your personal information.</p>
            <label className="flex w-full flex-col gap-1">
                Firstname
                <input className="rounded border px-2 outline-none ring-teal-400 ring-offset-2 focus:ring-2" name="firstname" type="text" />
                <span className="text-xs">Current: <span className="italic">{session?.data.firstname}</span></span>
            </label>
            <label className="flex w-full flex-col gap-1">
                Lastname
                <input className="rounded border px-2 outline-none ring-teal-400 ring-offset-2 focus:ring-2" name="lastname" type="text" />
                <span className="text-xs">Current: <span className="italic">{session?.data.lastname}</span></span>
            </label>
        </ProfileClient>

        <ProfileClient action="UpdateEmail" className="flex flex-col items-center justify-center gap-2 rounded-xl border p-4 shadow">
            <h2 className="text-2xl font-bold">Update email</h2>
            <p className="text-center text-xs text-gray-500">Link a new email to your account.</p>
            <div className="flex w-full flex-col items-center justify-center gap-2">
                <div className="w-full">
                    <div className="flex items-baseline justify-between">
                        <p>{session?.data.emailVerified ? `Verified` : `Not verified`}</p>
                        {session?.data.emailVerified ? null :
                            <ResendButtonClient name="notVerifiedEmail" />
                        }
                    </div>
                    <div className={`flex items-center justify-end gap-2 text-sm italic` + (session?.data.emailVerified ? ` text-green-500` : ` text-red-500`)}>
                        <span>{session?.data.email}</span>
                        {session?.data.emailVerified ?
                            <CircleCheck size={14} /> :
                            <CircleAlert size={14} />
                        }
                    </div>
                </div>
                <div className={`w-full` + (session?.data.newEmail ? `` : ` hidden`)}>
                    <div className="flex items-baseline justify-between">
                        <p>New email</p>
                        <ResendButtonClient name="notVerifiedNewEmail" />
                    </div>
                    <div className={`flex items-center justify-end gap-2 text-sm italic text-orange-500`}>
                        <span>{session?.data.newEmail}</span>
                        <CircleAlert size={14} />
                    </div>
                </div>
            </div>
            <label className="flex w-full flex-col gap-1">
                New email
                <input className="rounded border px-2 outline-none ring-teal-400 ring-offset-2 focus:ring-2" name="newEmail" type="email" required autoComplete="on" />
            </label>
        </ProfileClient >

        <ProfileClient action="UpdatePassword" className="flex flex-col items-center justify-center gap-2 rounded-xl border p-4 shadow">
            <h2 className="text-2xl font-bold">Change password</h2>
            <p className="text-center text-xs text-gray-500">Create a new password. <span className="font-bold">This action disconnects all your devices.</span></p>
        </ProfileClient>

        <ProfileClient action="DeleteAccount" className="flex flex-col items-center justify-center gap-2 rounded-xl border p-4 shadow">
            <h2 className="text-2xl font-bold">Delete account</h2>
            <p className="text-center text-xs text-gray-500">Delete your account and all your data. <span className="font-bold">This action is irreversible!</span></p>
        </ProfileClient>
    </div >
}