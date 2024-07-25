import CenterStartLayoutClient from "@client/client.center-start-layout";

export default function AuthLayout({ children }: { children: React.ReactNode }) {

    return <CenterStartLayoutClient className="flex flex-1 flex-col items-center gap-2 overflow-y-auto overflow-x-hidden p-4">
        {children}
    </CenterStartLayoutClient>
}