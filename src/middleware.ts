import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const protectedRoutes = {
    "/dashboard": ["ADMIN", "AUTHOR", "USER"],
    "/dashboard/admin": ["ADMIN"],
    "/dashboard/posts/manage": ["ADMIN", "AUTHOR"],
    "/dashboard/user-management": ["ADMIN"],
    "/dashboard/posts/create": ["ADMIN", "AUTHOR"],
    "/dashboard/posts": ["ADMIN", "AUTHOR"],
    "/dashboard/liked-post": ["ADMIN", "AUTHOR", "USER"],
    "/dashboard/saved-post": ["ADMIN", "AUTHOR", "USER"],
};

const publicRoutes = [
    "/",
    "/posts",
    "/api/posts",
    "/login",
    "/register",
    "/unauthorized",
    "/api/auth",
];

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    if (publicRoutes.some(route => path.startsWith(route))) {
        return NextResponse.next();
    }

    const requiredRoles = Object.entries(protectedRoutes).find(([route]) =>
        path.startsWith(route)
    )?.[1];

    if (!requiredRoles) {
        return NextResponse.next();
    }

    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
            id: string;
            email: string;
            role: string;
        };

        if (!requiredRoles.includes(decoded.role)) {
            return NextResponse.redirect(new URL("/unauthorized", request.url));
        }

        const response = NextResponse.next();
        response.headers.set("x-user", JSON.stringify({
            id: decoded.id,
            role: decoded.role,
            email: decoded.email
        }));

        return response;
    } catch (error) {
        console.error("Authentication error:", error);
        return NextResponse.redirect(new URL("/login", request.url));
    }
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|public).*)",
    ],
}; 