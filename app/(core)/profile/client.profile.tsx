"use client"

import { UpdateEmail, UpdateName, UpdatePassword } from "@auth/Update"
import { DeleteAccount } from "@auth/Delete"
import { FormEvent, useContext, useState } from "react"
import Loader from "@server/loader"
import FormFeedback from "@server/form-feedback"
import { Context } from "@app/client.context"
import { useRouter } from "next/navigation"
import Modal from "@comps/client/client.modal"
import PasswordInputClient from "@comps/client/client.password"
import Button from "@comps/ui/button"

export default function ProfileClient({ action, className, children }: {
    action: "UpdateName" | "UpdateEmail" | "UpdatePassword" | "DeleteAccount",
    className?: string,
    children: React.ReactNode
}) {
    const router = useRouter()

    const [loading, setLoading] = useState(false)
    const [mode, setMode] = useState<"" | "success" | "danger" | "warning">("")
    const [message, setMessage] = useState("")
    const [disabled, setDisabled] = useState(false)
    const [showModal, setShowModal] = useState(false)

    const client = useContext(Context)
    if (!client) {
        router.refresh()
        return <></>
    }

    const ServerAction = {
        UpdateName,
        UpdateEmail,
        UpdatePassword,
        DeleteAccount
    }[action]

    const update = (e: FormEvent<HTMLFormElement>) => {
        // Prevent the default form submission, and set the loading state
        e.preventDefault()
        setLoading(true)
        setDisabled(true)

        interface OptionalData {
            firstname: string,
            lastname: string
            newEmail: string
            password: string,
            newPassword: string,
            csrfToken: string,
            clientId: string
        }

        // Call the login function
        const data: OptionalData = {
            firstname: (e.target as HTMLFormElement)["firstname"]?.value,
            lastname: (e.target as HTMLFormElement)["lastname"]?.value,
            newEmail: (e.target as HTMLFormElement)["newEmail"]?.value,
            password: (e.target as HTMLFormElement)["currentPassword"]?.value,
            newPassword: (e.target as HTMLFormElement)["newPassword"]?.value,
            csrfToken: (e.target as HTMLFormElement).getAttribute("data-token") as string,
            clientId: client.data.clientId
        }

        ServerAction(data).then(({ success, error }) => {
            if (success) {
                setLoading(false)
                setMode("success")
                setMessage(success)
                setDisabled(false)

                if (action === "DeleteAccount") {
                    router.push("/logout")
                }

                const formEl = e.target as HTMLFormElement
                formEl.reset()
            }
            if (error) {
                setLoading(false)
                setMode("danger")
                setMessage(error)
                setDisabled(false)

                const formEl = e.target as HTMLFormElement
                formEl.reset()
            }
        })
    }

    const submitForm = (e: React.MouseEvent<HTMLButtonElement>) => {
        // Get the form element
        const buttonEl = e.target as HTMLButtonElement
        const modalEl = buttonEl.parentElement?.parentElement as HTMLDivElement
        const formEl = modalEl.parentElement?.parentElement?.parentElement as HTMLFormElement

        // Get all required input elements
        const inputElList = Array.from(formEl.querySelectorAll("input[required]"))
        const modalInputElList = Array.from(modalEl.querySelectorAll("input[required]"))
        const nonModalInputElList = inputElList.filter(inputEl => !modalInputElList.includes(inputEl))

        // Check if all required inputs are filled
        const emptyInputElList = inputElList.filter(inputEl => !(inputEl as HTMLInputElement).value)
        const nonModalEmptyInputElList = nonModalInputElList.filter(inputEl => !(inputEl as HTMLInputElement).value)

        // If there are empty inputs outside the modal
        if (!emptyInputElList.length || nonModalEmptyInputElList.length) setShowModal(false)

        // Submit the form
        formEl.requestSubmit()
    }

    return <form onSubmit={(e) => update(e)} className={className}>
        {children}
        <FormFeedback mode={mode}>{message}</FormFeedback>
        <Button type="button" disabled={disabled} onClick={() => setShowModal(true)} className="flex items-center justify-center gap-2">{
            loading ?
                <>
                    <Loader />
                    <span>Loading...</span>
                </> :
                action === "DeleteAccount" ?
                    "Delete" :
                    "Update"
        }</Button>
        <Modal
            show={showModal}
            title={action === "DeleteAccount" ?
                "Delete account?" :
                "Update?"}
            body={action === "DeleteAccount" ?
                "This action is irreversible. Are you sure you want to delete your account?" :
                "Please type your password to confirm the action."}
            confirmButtonText={action === "DeleteAccount" ?
                "Delete" :
                "Update"}
            confirmButtonStyle={action === "DeleteAccount" ?
                "danger" :
                "default"}
            confirmButtonType="button"
            inverseButtons={action === "DeleteAccount"}
            onConfirm={(e) => submitForm(e)}
            onCancel={() => setShowModal(false)}
        >
            <label className="flex w-full flex-col gap-1">
                Password
                <input className="rounded border px-2 outline-none ring-teal-400 ring-offset-2 focus:ring-2" name="currentPassword" type="password" required autoComplete="on" />
            </label>
            {action === "UpdatePassword" ?
                <label className="flex w-full flex-col gap-1">
                    New password
                    <PasswordInputClient className="rounded border px-2 outline-none ring-teal-400 ring-offset-2 focus:ring-2" name="newPassword" required autoComplete="on" />
                </label> :
                null
            }
        </Modal>
    </form>
}