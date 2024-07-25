import Button from "@comps/ui/button";

export default function NotFoundPage() {
    return <main className="flex flex-1 flex-col items-center justify-center gap-2">
        <h1 className="text-2xl font-bold">Oh no!</h1>
        <p>The page you are looking for does not exist.</p>
        <div className="flex flex-row items-center justify-center gap-2">
            <Button type="link" href="/">Home</Button>
        </div>
    </main>
}