import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "./prisma";

export interface AuthenticatedRequest extends NextRequest {
    user?: {
        id: string;
        email: string;
        role: string;
    };
}

export async function authenticateAPI(
    request: AuthenticatedRequest,
    requiredRoles?: string[]
) {
    try {
        const token = request.cookies.get("auth_token")?.value;

        if (!token) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
            id: string;
            email: string;
            role: string;
        };

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: { id: true, role: true, email: true },
        });

        if (!user) {
            return NextResponse.json(
                { error: "User no longer exists" },
                { status: 401 }
            );
        }

        if (requiredRoles && !requiredRoles.includes(user.role)) {
            return NextResponse.json(
                { error: "Insufficient permissions" },
                { status: 403 }
            );
        }

        request.user = user;
        return null;
    } catch (error) {
        console.error("Authentication error:", error);
        return NextResponse.json(
            { error: "Invalid authentication" },
            { status: 401 }
        );
    }
}