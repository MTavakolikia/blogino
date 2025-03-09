import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const protectedRoutes = {
    "/dashboard/admin": ["ADMIN"],
    "/dashboard/posts/manage": ["ADMIN", "AUTHOR"],
    "/dashboard/user-management": ["ADMIN"],
    "/dashboard/posts/create": ["ADMIN", "AUTHOR"],
    "/dashboard/posts": ["ADMIN", "AUTHOR"],
};

export function middleware(request: NextRequest) {
    const token = request.cookies.get("auth_token")?.value;
    const path = request.nextUrl.pathname;

    const requiredRoles = Object.entries(protectedRoutes).find(([route]) =>
        path.startsWith(route)
    )?.[1];

    if (!token) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
            id: string;
            email: string;
            role: string;
        };

        if (requiredRoles && !requiredRoles.includes(decoded.role)) {
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