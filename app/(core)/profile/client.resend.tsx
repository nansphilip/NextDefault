"use client"

import { Context } from "@app/client.context"
import { ResendEmail } from "@auth/update"
import Button from "@comps/ui/button"
import { useRouter } from "next/navigation"
import { useContext, useState } from "react"

export default function ResendButtonClient({ name }: {
    name: string,
}) {
    const router = useRouter()
    const [response, setResponse] = useState<string>("Resend link?")

    const client = useContext(Context)
    if (!client) {
        router.refresh()
        return <></>
    }

    const resend = async (name: string) => {
        ResendEmail(name, client.data.clientId).then((response) => {
            setResponse(response.success ?? response.error)
        })
    }

    return <Button
        type="button"
        variant="link"
        fontSize="xs"
        buttonSize="none"
        ring="none"
        onClick={() => resend(name)}
        disabled={response == "Resend link?" ? false : true}
    >
        {response}
    </Button>
}