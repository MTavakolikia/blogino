import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { prisma } from "@/utils/prisma";

type Role = "ADMIN" | "AUTHOR" | "USER";

export interface DashboardUser {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: Role;
    profilePic: string | null;
    active: boolean;
    createdAt: Date;
}

function safeDecode(token: string) {
    try {
        return jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    } catch {
        return null;
    }
}

/**
 * Server-side auth guard for dashboard pages.
 * Verifies the httpOnly `auth_token` JWT, redirects to /login when
 * missing/invalid, and to /unauthorized when the role doesn't match.
 */
export async function getDashboardUser(requiredRoles?: Role[]): Promise<DashboardUser> {
    const token = (await cookies()).get("auth_token")?.value;

    if (!token) redirect("/login");

    const decoded = safeDecode(token);
    if (!decoded) redirect("/login");

    const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            profilePic: true,
            active: true,
            createdAt: true,
        },
    });

    if (!user || !user.active) redirect("/login");

    if (requiredRoles && !requiredRoles.includes(user.role)) {
        redirect("/unauthorized");
    }

    return user;
}
