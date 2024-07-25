export default function FormFeedback({
    mode = "" || "success" || "danger" || "warning",
    className,
    children,
}: {
    mode?: "" | "success" | "danger" | "warning",
    className?: string
    children: React.ReactNode,
}) {

    if (mode === "") return <></>

    const color = {
        "success":  "bg-green-200 border-green-400",
        "danger": "bg-red-200 border-red-400",
        "warning": "bg-orange-200 border-orange-400",
    }

    const classList = `${color[mode]} border w-full rounded px-2 text-sm `

    return <div className={classList + className}>
        {children}
    </div>
}