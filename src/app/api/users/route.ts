import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";
import { authenticateAPI, AuthenticatedRequest } from "@/utils/apiAuth";
import { purgeUser } from "@/utils/purgeUser";

const publicUserSelect = {
    id: true,
    firstName: true,
    lastName: true,
    email: true,
    role: true,
    profilePic: true,
    active: true,
    createdAt: true,
    updatedAt: true,
} as const;

export async function GET(request: AuthenticatedRequest) {
    try {
        const authError = await authenticateAPI(request, ["ADMIN"]);
        if (authError) return authError;

        const users = await prisma.user.findMany({
            select: publicUserSelect,
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(users, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}

export async function POST(request: AuthenticatedRequest) {
    try {
        const authError = await authenticateAPI(request, ["ADMIN"]);
        if (authError) return authError;

        const body = await request.json();
        const { firstName, lastName, email, role, profilePic, password } = body;

        if (!firstName || !lastName || !email || !password) {
            return NextResponse.json(
                { error: "First name, last name, email and password are required" },
                { status: 400 },
            );
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });

        if (existingUser) {
            return NextResponse.json(
                { error: "Email already exists", code: "EMAIL_EXISTS" },
                { status: 409 },
            );
        }

        const newUser = await prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                role: role === "ADMIN" || role === "AUTHOR" ? role : "USER",
                profilePic: profilePic || null,
                password: await bcryptHash(password),
            },
            select: publicUserSelect,
        });
        return NextResponse.json(newUser, { status: 201 });
    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
    }
}

export async function PATCH(request: AuthenticatedRequest) {
    try {
        const authError = await authenticateAPI(request);
        if (authError) return authError;

        const { id, firstName, lastName, email, role, profilePic, active } =
            await request.json();

        if (!id) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        const isAdmin = request.user!.role === "ADMIN";
        const isSelf = request.user!.id === id;

        if (!isAdmin && !isSelf) {
            return NextResponse.json(
                { error: "You can only update your own profile" },
                { status: 403 },
            );
        }

        const data: Record<string, unknown> = {};
        if (firstName !== undefined) data.firstName = firstName;
        if (lastName !== undefined) data.lastName = lastName;
        if (email !== undefined) data.email = email;
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
            where: { id },
            data,
            select: publicUserSelect,
        });
        return NextResponse.json(updatedUser, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
    }
}

export async function DELETE(request: AuthenticatedRequest) {
    try {
        const authError = await authenticateAPI(request, ["ADMIN"]);
        if (authError) return authError;

        const { id } = await request.json();

        if (!id) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }
        if (id === request.user!.id) {
            return NextResponse.json(
                { error: "You cannot delete your own account here" },
                { status: 400 },
            );
        }

        await purgeUser(id);
        return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
    }
}

async function bcryptHash(password: string) {
    const bcrypt = await import("bcryptjs");
    return bcrypt.hash(password, 10);
}
