import { DeleteSessionDB, SelectSessionDB } from "@database/Session"
import LogoutClient from "@app/(auth)/logout/client.logout"
import { GetSession } from "@cookies/session"
import Loader from "@comps/server/loader"

export default async function LogoutPage() {

    return <LogoutClient>
        <Loader />
    </LogoutClient>
}

