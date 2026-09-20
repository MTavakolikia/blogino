import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";
import { authenticateAPI, AuthenticatedRequest } from "@/utils/apiAuth";
import { hashPassword, verifyPassword } from "@/utils/auth";

export async function POST(request: AuthenticatedRequest) {
    try {
        const authError = await authenticateAPI(request);
        if (authError) return authError;

        const { currentPassword, newPassword } = await request.json();

        if (!currentPassword || !newPassword) {
            return NextResponse.json(
                { error: "Current and new password are required" },
                { status: 400 },
            );
        }

        if (newPassword.length < 6) {
            return NextResponse.json(
                { error: "New password must be at least 6 characters" },
                { status: 400 },
            );
        }

        const user = await prisma.user.findUnique({
            where: { id: request.user!.id },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const isMatch = await verifyPassword(currentPassword, user.password);
        if (!isMatch) {
            return NextResponse.json(
                { error: "Current password is incorrect" },
                { status: 401 },
            );
        }

        const hashedPassword = await hashPassword(newPassword);
        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword },
        });

        return NextResponse.json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Error changing password:", error);
        return NextResponse.json(
            { error: "Failed to change password" },
            { status: 500 },
        );
    }
}
