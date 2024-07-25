import VerifyClient from "@app/(auth)/verify/client.verify"
import { GetSession } from "@cookies/Session"
import Button from "@comps/ui/button"

export default async function VerifyPage() {

    const session = await GetSession()

    return <div className="flex flex-col items-center justify-center gap-2 rounded-xl border p-4 shadow">
        <VerifyClient session={session} />
        <Button type="link" variant="outline" href="/">Home</Button>
    </div>
}