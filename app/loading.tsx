import Loader from "@comps/server/loader";

export default function LoadingPage() {
    return <main className="flex flex-1 flex-col items-center justify-center gap-2">
        <Loader />
    </main>
}