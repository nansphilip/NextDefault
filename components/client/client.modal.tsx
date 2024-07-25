import Button from "@comps/ui/button"

export default function Modal({ children, show, title, body, confirmButtonText, confirmButtonStyle, confirmButtonType="button", inverseButtons=false, onConfirm, onCancel }: {
    children: React.ReactNode,
    show: boolean,
    title: string,
    body: string,
    confirmButtonText: string,
    confirmButtonStyle: "default" | "danger",
    confirmButtonType?: "submit" | "button",
    inverseButtons?: boolean,
    onConfirm: (e: React.MouseEvent<HTMLButtonElement>) => void,
    onCancel: () => void,
}) {

    return <div className={`fixed left-0 top-0 size-full transition-opacity` + (show ? `` : ` hidden`)}>
        <div className="fixed size-full bg-gray-400 opacity-70"></div>
        <Button type="button" variant="transparent" buttonSize="none" ring="none" onClick={onCancel} className="fixed size-full backdrop-blur-sm"/>
        <div className="pointer-events-none fixed flex size-full items-center justify-center">
            <div className="pointer-events-auto flex w-[260px] flex-col items-center justify-center gap-2 rounded-xl border-2 bg-white p-4 shadow shadow-gray-400">
                <h2 className="text-2xl font-bold">{title}</h2>
                <p className="text-xs text-gray-500">{body}</p>
                {children}
                <div className="flex items-center justify-center gap-8">
                    {inverseButtons ? null : <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>}
                    <Button type={confirmButtonType} onClick={onConfirm} variant={confirmButtonStyle}>{confirmButtonText}</Button>
                    {inverseButtons ? <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button> : null}
                </div>
            </div>
        </div>
    </div>
}