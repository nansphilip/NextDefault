import { GetSession } from "@cookies/session"
import ResetClient from "@app/(auth)/reset/client.reset"

export default async function ResetPage() {

    const session = await GetSession()

    return <>
        <ResetClient session={session} className="flex w-[260px] flex-col items-center justify-center gap-2 rounded-xl border p-4 shadow">
            <h2 className="text-2xl font-bold">Forgot password</h2>
        </ResetClient>
    </>
}