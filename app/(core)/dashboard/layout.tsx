import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Dashboard",
    description: "Dashboard page.",
}

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {

    return <>{children}</>
}
