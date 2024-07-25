"use client"

import SlidingHoverClient from "@client/client.sliding-motion"
import { usePathname } from "next/navigation"
import { SessionCookies } from "@lib/Types"
import Button from "@comps/ui/button"

export default function HeaderClient({ session }: {
    session: SessionCookies | null
}) {
    // Get the current pathname
    const pathname = usePathname()

    const HeaderLink = ({ href, children }: {
        href: string,
        children: React.ReactNode
    }) => {
        // If current page and href are the same, add font-semibold class
        const currentPage = pathname === href ? " font-semibold" : ""
        
        return <Button type="link"
            variant="transparent"
            buttonSize="lg"
            fontSize="md"
            ring="none"
            href={href}
            className={`${currentPage} ring-teal-400 disabled:ring-0 max-md:active:ring-2`}
        >
            {children}
        </Button>
    }

    return <>
        {/* Mobile */}
        <nav className="flex h-12 items-center justify-center md:hidden">
            <HeaderLink href="/">Home</HeaderLink>
            {session ? <>
                <HeaderLink href="/dashboard">Dashboard</HeaderLink>
                <HeaderLink href="/profile">Profile</HeaderLink>
            </> : <>
                <HeaderLink href="/register">Register</HeaderLink>
                <HeaderLink href="/login">Login</HeaderLink>
            </>}
        </nav>

        {/* Desktop */}
        <nav className="flex h-12 items-center justify-center max-md:hidden">
            <SlidingHoverClient
                className="flex gap-2"
                color="bg-gray-200"
                rounded="rounded-md"
                duration="duration-300"
            >
                <HeaderLink href="/">Home</HeaderLink>
                {session ? <>
                    <HeaderLink href="/dashboard">Dashboard</HeaderLink>
                    <HeaderLink href="/profile">Profile</HeaderLink>
                </> : <>
                    <HeaderLink href="/register">Register</HeaderLink>
                    <HeaderLink href="/login">Login</HeaderLink>
                </>}
            </SlidingHoverClient>
        </nav>
    </>
}