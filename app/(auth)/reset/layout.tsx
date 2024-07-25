import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Reset password",
    description: "Reset password page.",
}

export default function ResetLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {

    return <>{children}</>
}
