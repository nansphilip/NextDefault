"use client"

import { useEffect } from "react"

/**
 * A sliding hover effect that follows the mouse cursor
 * @requires Next.js Client Component: "use client"
 * @param color the hover background color
 * @param rounded the size of the border radius
 * @param duration the transition duration
 * @param className additional classes like "flex gap-4"
 * @example
 * ```tsx
 *  <SlidingHoverClient className="flex gap-4" color="bg-slate-200" rounded="rounded-md" duration="duration-300">
        <HeaderLink href="/">Home</HeaderLink>
        <HeaderLink href="/register">Register</HeaderLink>
        <HeaderLink href="/sign-in">Sign-in</HeaderLink>
    </SlidingHoverClient>
 * ```
 */
export default function SlidingHoverClient({ color, rounded, duration, className, children }: {
    color?: string,
    rounded?: string
    duration?: string
    className?: string,
    children: React.ReactNode
}) {

    useEffect(() => {
        const slidingEl = document.querySelector("#sliding-element") as HTMLElement

        // Set default opacity to 0
        slidingEl.style.opacity = "0"

        // Move, resize and show the element
        const moveResizeAndShowElement = (e: MouseEvent) => {
            const hoveredEl = document.elementFromPoint(e.clientX, e.clientY)

            // If hovered element is a link <a href="">
            if (hoveredEl?.nodeName === "A") {
                slidingEl.style.opacity = "1"

                // Get hovered element properties
                const { height, width, top, left } = hoveredEl.getBoundingClientRect()

                // Set the dimensions
                slidingEl.style.height = height + "px"
                slidingEl.style.width = width + "px"

                // Set the position
                slidingEl.style.top = top + "px"
                slidingEl.style.left = left + "px"
            }
        }

        // Hide the element
        const hideElement = () => {
            slidingEl.style.opacity = "0"
        }

        // Manage event listeners
        const slidingContainer = slidingEl.parentElement

        slidingContainer?.addEventListener("mousemove", (e) => moveResizeAndShowElement(e as MouseEvent))
        slidingContainer?.addEventListener("mouseleave", () => hideElement())

        return () => {
            slidingContainer?.removeEventListener("mousemove", (e) => moveResizeAndShowElement(e as MouseEvent))
            slidingContainer?.removeEventListener("mouseleave", () => hideElement())
        }
    }, [])

    return <div className={className}>
        {children}
        <div
            id="sliding-element"
            className={`absolute -z-10 transition-all ${color} ${rounded} ${duration}`}
        ></div>
    </div>
}