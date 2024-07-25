"use client"

import { SessionCookies } from "@lib/Types"
import { useEffect, useState } from "react"

export default function TimerClient({ session, className, sessionData, text }: {
    session: SessionCookies | null,
    className: string
    sessionData: keyof SessionCookies["settings"]
    text?: "ago" | "left"
}) {

    const [time, setTime] = useState("0s")

    const refreshTimer = () => {
        if (!text) {
            const date = new Date(session?.settings[sessionData] as Date)
                .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                .replace(':', 'h')

            setTime(date)
        } else {
            let time = 0

            if (sessionData === "created")
                time = new Date().getTime() - new Date(session?.settings[sessionData] as Date).getTime()
            else if (sessionData === "updated")
                time = new Date().getTime() - new Date(session?.settings[sessionData] as Date).getTime()
            else if (sessionData === "expires")
                time = new Date(session?.settings[sessionData] as Date).getTime() - new Date().getTime()

            const seconds = Math.floor(time / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);

            const remainingSeconds = seconds % 60;
            const remainingMinutes = minutes % 60;

            let date = ""

            if (hours > 0)
                date += `${hours}h`;
            if (!hours && minutes > 0)
                date += `${remainingMinutes}min`;
            if (!hours && !minutes && remainingSeconds >= 0)
                date += `${remainingSeconds}s`;

            setTime(date)
        }
    }

    useEffect(() => {
        // On load
        refreshTimer()

        // Every second
        if (text) {
            const intervalId = setInterval(refreshTimer, 1000);
            return () => clearInterval(intervalId);
        }
    })

    return <span className={className}>
        {time} {text}
    </span>
}
