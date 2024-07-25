import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Verify",
    description: "Verify page.",
}

export default function VerifyLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {

    return <>{children}</>
}
