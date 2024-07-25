import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Profile",
    description: "Edit profile page.",
}

export default function ProfileLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {

    return <>{children}</>
}
