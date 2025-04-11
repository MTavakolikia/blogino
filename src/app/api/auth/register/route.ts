import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";
import { hashPassword } from "@/utils/auth";

export async function POST(request: Request) {
    try {
        const { firstName, lastName, email, password } = await request.json();

        if (!firstName || !lastName || !email || !password) {
            return NextResponse.json(
                {
                    error: "Missing required fields",
                    details: "First name, last name, email, and password are required",
                },
                { status: 400 }
            );
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });

        if (existingUser) {
            return NextResponse.json(
                {
                    error: "User already exists",
                    details: "A user with this email already exists",
                },
                { status: 409 }
            );
        }

        const hashedPassword = await hashPassword(password);

        const user = await prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                password: hashedPassword,
                role: "AUTHOR",
            },
        });

        const { password: _, ...userWithoutPassword } = user;

        return NextResponse.json(userWithoutPassword, { status: 201 });
    } catch (error) {
        console.error("Error during registration:", error);
        return NextResponse.json(
            {
                error: "Failed to register user",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
