import LoginClient from "@app/(auth)/login/client.login"
import Button from "@comps/ui/button"
import { GetSession } from "@cookies/Session"

export default async function LoginPage() {

    const session = await GetSession()

    return <LoginClient session={session} className="flex w-[260px] flex-col items-center justify-center gap-2 rounded-xl border p-4 shadow">
        <h2 className="text-2xl font-bold">Login</h2>
        <p className="text-center text-xs text-gray-500">Login with your email and password.</p>
        <label className="flex w-full flex-col gap-1">
            Email
            <input className="rounded border px-2 outline-none ring-teal-400 ring-offset-2 focus:ring-2" name="email" type="email" required autoFocus />
        </label>
        <label className="flex w-full flex-col gap-1">
            Password
            <input className="rounded border px-2 outline-none ring-teal-400 ring-offset-2 focus:ring-2" name="password" type="password" required />
        </label>
        <div className="flex flex-col items-center justify-center">
            <Button type="link" variant="link" ring="none" fontSize="sm" href="/register">Not registered yet?</Button>
            <p className="text-xs text-gray-300">or</p>
            <Button type="link" variant="link" ring="none" fontSize="sm" href="/reset">Forgot password?</Button>
        </div>
    </LoginClient>
}