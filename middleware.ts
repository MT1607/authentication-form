import {NextRequest, NextResponse} from "next/server";

export function middleware(req: NextRequest) {
    console.log("Middleware running for:", req.nextUrl.pathname);

    const token = req.cookies.get("jwt")?.value;

    if (!token) {
        console.log("No token found → Redirecting to login...");
        console.log("req url: ", req.url)
        return NextResponse.redirect(new URL("/login", req.url));
    }
    console.log("Token found → Redirecting to new page...");
    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard", "/dashboard/:path*"]
}