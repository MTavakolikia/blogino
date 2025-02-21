import { prisma } from "@/utils/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const users = await prisma.user.findMany();
        return NextResponse.json(users, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { firstName, lastName, email, role, profilePic } = await req.json();
        const newUser = await prisma.user.create({
            data: { firstName, lastName, email, role, profilePic },
        });
        return NextResponse.json(newUser, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const { id, firstName, lastName, email, role, profilePic } = await req.json();
        const updatedUser = await prisma.user.update({
            where: { id },
            data: { firstName, lastName, email, role, profilePic },
        });
        return NextResponse.json(updatedUser, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { id } = await req.json();
        await prisma.user.delete({ where: { id } });
        return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
    }
}
