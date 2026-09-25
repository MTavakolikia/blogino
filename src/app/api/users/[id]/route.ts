import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";
import { authenticateAPI, AuthenticatedRequest } from "@/utils/apiAuth";
import { purgeUser } from "@/utils/purgeUser";

export async function PATCH(
    request: AuthenticatedRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const authError = await authenticateAPI(request);
        if (authError) return authError;

        const body = await request.json();
        const { profilePic, role, active } = body;
        const { id: userId } = await params;

        const isAdmin = request.user!.role === "ADMIN";
        const isSelf = request.user!.id === userId;

        if (!isAdmin && !isSelf) {
            return NextResponse.json(
                { error: "You can only update your own profile" },
                { status: 403 },
            );
        }

        const data: Record<string, unknown> = {};
        if (profilePic !== undefined) data.profilePic = profilePic;

        // Sensitive fields are admin-only.
        if (isAdmin) {
            if (role !== undefined) {
                if (!["ADMIN", "AUTHOR", "USER"].includes(role)) {
                    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
                }
                data.role = role;
            }
            if (active !== undefined) data.active = active;
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data,
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                profilePic: true,
                active: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return NextResponse.json(updatedUser, { status: 200 });
    } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json(
            {
                error: "Failed to update user",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 },
        );
    }
}

export async function GET(
    request: AuthenticatedRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id: userId } = await params;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                profilePic: true,
                active: true,
                createdAt: true,
                _count: { select: { posts: { where: { published: true } } } },
            },
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found", details: "The specified user does not exist" },
                { status: 404 },
            );
        }

        return NextResponse.json(
            {
                ...user,
                createdAt: user.createdAt.toISOString(),
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json(
            {
                error: "Failed to fetch user",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 },
        );
    }
}

export async function DELETE(
    request: AuthenticatedRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const authError = await authenticateAPI(request, ["ADMIN"]);
        if (authError) return authError;

        const { id: userId } = await params;

        if (userId === request.user!.id) {
            return NextResponse.json(
                { error: "You cannot delete your own account" },
                { status: 400 },
            );
        }

        await purgeUser(userId);

        return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting user:", error);
        return NextResponse.json(
            {
                error: "Failed to delete user",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 },
        );
    }
}
