import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import { prisma } from "@/utils/prisma";

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return NextResponse.json({ error: "کاربر یافت نشد!" }, { status: 404 });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ error: "رمز عبور اشتباه است!" }, { status: 401 });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET!,
            { expiresIn: "7d" }
        );

        const cookie = serialize("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });

        const response = NextResponse.json({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
        });
        response.headers.set("Set-Cookie", cookie);
        return response;
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Some error occurred!" }, { status: 500 });
    }
}
