import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    const response = NextResponse.next();
    response.headers.set("x-user", JSON.stringify({ tokenPresent: true }));

    return response;
}

// مسیرهای محافظت شده
export const config = {
    matcher: ["/dashboard/:path*", "/profile/:path*"],
};