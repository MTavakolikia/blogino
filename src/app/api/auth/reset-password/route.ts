import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";
import { hashPassword } from "@/utils/auth";

export async function POST(req: Request) {
    try {
        const { token, newPassword } = await req.json();

        const user = await prisma.user.findFirst({
            where: {
                resetToken: token,
                resetTokenExpiry: { gte: new Date() },
            },
        });

        if (!user) {
            return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
        }

        // هش کردن پسورد جدید
        const hashedPassword = await hashPassword(newPassword);

        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword, resetToken: null, resetTokenExpiry: null },
        });

        return NextResponse.json({ message: "Password has been reset successfully" });
    } catch (error) {
        console.error("Error during password reset:", error);
        return NextResponse.json(
            { error: "Failed to reset password" },
            { status: 500 }
        );
    }
}
