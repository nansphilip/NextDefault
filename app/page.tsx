import { GetSession } from "@cookies/Session";
import Button from "@comps/ui/button";

export default async function Home() {
  const session = await GetSession();

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-2">
      <h1 className="text-4xl font-bold">Next Ready</h1>
      <div className="flex gap-2">
        {session ? (
          <>
            <Button type="link" href="/logout" variant="outline">
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button type="link" href="/register" variant="outline">
              Register
            </Button>
            <Button type="link" href="/login">
              Login
            </Button>
          </>
        )}
      </div>
      {/* <Button type="button" variant="default" animation={true} ring="none" className="h-12 w-24 text-xl">Wave</Button> */}
    </main>
  );
}
