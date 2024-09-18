import { RefreshSession } from "@cookies/session";
import { NextRequest } from "next/server";

export default async function middleware(request: NextRequest) {

    return await RefreshSession(request)
}
