import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
    try {
        const { profilePic, role, active } = await request.json();
        const userId = params.id;

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { profilePic, role, active },
        });

        return NextResponse.json(updatedUser, { status: 200 });
    } catch (error) {
        console.error("Error updating user profile picture:", error);
        return NextResponse.json(
            {
                error: "Failed to update profile picture",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const userId = params.id;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { firstName: true, lastName: true, profilePic: true },
        });


        if (!user) {
            return NextResponse.json(
                {
                    error: "User not found",
                    details: "The specified user does not exist",
                },
                { status: 404 }
            );
        }

        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json(
            {
                error: "Failed to fetch user",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const userId = params.id;

        const deletedUser = await prisma.user.delete({
            where: { id: userId },
        });

        return NextResponse.json(deletedUser, { status: 200 });
    } catch (error) {
        console.error("Error deleting user:", error);
        return NextResponse.json(
            {
                error: "Failed to delete user",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}

