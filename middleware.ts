import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";


export function middleware(request: NextRequest) {

    const token = request.cookies.get("token");

    const pathname = request.nextUrl.pathname;


    if (pathname === "/") {

        return NextResponse.redirect(
            new URL(
                token ? "/dashboard" : "/login",
                request.url
            )
        );
    }


    return NextResponse.next();
}


export const config = {
    matcher: [
        "/",
    ],
};