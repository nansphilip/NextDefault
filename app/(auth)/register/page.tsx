import RegisterClient from "@app/(auth)/register/client.register"
import { GetSession } from "@cookies/Session"
import PasswordInputClient from "@comps/client/client.password"
import Button from "@comps/ui/button"

export default async function RegisterPage() {

    const session = await GetSession()

    return <RegisterClient session={session} className="flex w-[260px] flex-col items-center justify-center gap-2 rounded-xl border p-4 shadow">
        <h2 className="text-2xl font-bold">Register</h2>
        <p className="text-center text-xs text-gray-500">Register with your personal informations.</p>
        <label className="flex w-full flex-col gap-1">
            Firstname
            <input className="rounded border px-2 outline-none ring-teal-400 ring-offset-2 focus:ring-2" name="firstname" type="text" autoComplete="on" autoFocus />
        </label>
        <label className="flex w-full flex-col gap-1">
            Lastname
            <input className="rounded border px-2 outline-none ring-teal-400 ring-offset-2 focus:ring-2" name="lastname" type="text" autoComplete="on" />
        </label>
        <label className="flex w-full flex-col gap-1">
            <div>
                <span>Email </span>
                <span className="text-red-500">*</span>
            </div>
            <input className="rounded border px-2 outline-none ring-teal-400 ring-offset-2 focus:ring-2" name="email" type="email" required autoComplete="on" />
        </label>
        <label className="flex w-full flex-col gap-1">
            <div>
                <span>Password </span>
                <span className="text-red-500">*</span>
            </div>
            <PasswordInputClient className="rounded border px-2 outline-none ring-teal-400 ring-offset-2 focus:ring-2" name="newPassword" required autoComplete="on" />
        </label>
        <Button type="link" variant="link" ring="none" fontSize="sm" href="/login">Already registered?</Button>
    </RegisterClient>
}