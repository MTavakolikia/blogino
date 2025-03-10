import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

// Define protected routes and their required roles
const protectedRoutes = {
    "/dashboard": ["ADMIN", "AUTHOR", "USER"], // All authenticated users can access dashboard
    "/dashboard/admin": ["ADMIN"],
    "/dashboard/posts/manage": ["ADMIN", "AUTHOR"],
    "/dashboard/user-management": ["ADMIN"],
    "/dashboard/posts/create": ["ADMIN", "AUTHOR"],
    "/dashboard/posts": ["ADMIN", "AUTHOR"],
};

// Define public routes that don't require authentication
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

    // Check if the route is public
    if (publicRoutes.some(route => path.startsWith(route))) {
        return NextResponse.next();
    }

    // Check if the route requires protection
    const requiredRoles = Object.entries(protectedRoutes).find(([route]) =>
        path.startsWith(route)
    )?.[1];

    // If no roles are required for this route, allow access
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

// Configure which routes to run middleware on
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        "/((?!_next/static|_next/image|favicon.ico|public).*)",
    ],
}; 