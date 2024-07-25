"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

/**
 * Toggle `justify-start` and `justify-center` based on the main height compared to the sum of children height.
 */
export default function CenterStartLayoutClient({ children, className }: {
    children: React.ReactNode,
    className?: string
}) {
    // Used to trigger the useEffect on pathname change
    const pathname = usePathname()

    const [mainGreaterThanChildren, setMainGreaterThanChildren] = useState<"justify-start" | "justify-center">("justify-start")

    /**
     * Toggle `justify-start` and `justify-center`,
     * based on the main height compared to the sum of children height.
     */
    const toggleJustifyStartAndCenter = () => {
        const mainEl = document.querySelector("main") as HTMLElement

        // Get the padding height
        const paddingHeight = Number(getComputedStyle(mainEl).getPropertyValue('padding').replace("px", ""))

        // Get the main height without the padding
        const mainHeight = mainEl.clientHeight - paddingHeight * 2

        // Get the children sum height
        const childrenHeight = Array.from(mainEl.children)
            .reduce((sum, el) => sum + (el as HTMLElement).clientHeight, 0)

        // Toggle the main classes
        if (mainHeight > childrenHeight) setMainGreaterThanChildren("justify-center")
        else setMainGreaterThanChildren("justify-start")
    }

    useEffect(() => {
        // On load
        toggleJustifyStartAndCenter()

        // On resize
        window.addEventListener("resize", toggleJustifyStartAndCenter)

        // On unmount
        return () => window.removeEventListener("resize", toggleJustifyStartAndCenter)
    }, [pathname])

    return <main className={`${className} ${mainGreaterThanChildren}`}>
        {children}
    </main>
}