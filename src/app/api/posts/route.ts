// app/api/posts/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function POST(request: Request) {
    const { title, content } = await request.json();

    try {
        const post = await prisma.post.create({
            data: {
                title,
                content,
            },
        });

        // اعتبارسنجی صفحه اصلی
        revalidatePath("/");

        return NextResponse.json(post, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to create post" },
            { status: 500 }
        );
    }
}


export async function GET() {
    try {
        const posts = await prisma.post.findMany();
        return NextResponse.json(posts, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch posts" },
            { status: 500 }
        );
    }
} 