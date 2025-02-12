import { NextRequest, NextResponse } from "next/server";
import { authenticateUser } from "@/lib/auth";

export async function middleware(req: NextRequest) {
    const token = req.cookies.get("auth_token")?.value;

    if (!token) {
        if (req.nextUrl.pathname.startsWith("/dashboard") || req.nextUrl.pathname.startsWith("/admin")) {
            return NextResponse.redirect(new URL("/login", req.nextUrl));
        }
    } else {
        const user = authenticateUser(req);
        if (!user) {
            if (req.nextUrl.pathname.startsWith("/dashboard") || req.nextUrl.pathname.startsWith("/admin")) {
                return NextResponse.redirect(new URL("/login", req.nextUrl));
            }
        } else {
            if (req.nextUrl.pathname.startsWith("/admin") && user.role !== "ADMIN") {
                return NextResponse.redirect(new URL("/", req.nextUrl));
            }
        }
    }

    return NextResponse.next();
}