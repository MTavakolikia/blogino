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
        revalidatePath("/");

        return NextResponse.json(post, { status: 201 });
    } catch (error) {
        console.error("Error creating post:", error); // خطا را در کنسول سرور چاپ کنید

        // برگرداندن خطا به کلاینت به صورت قابل فهم
        return NextResponse.json(
            {
                error: "Failed to create post",
                details: error.message || "Unknown error" // جزئیات خطا
            },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const posts = await prisma.post.findMany();
        return NextResponse.json(posts, { status: 200 });
    } catch (error) {
        console.error("Error fetching posts:", error); // خطا را در کنسول سرور چاپ کنید

        // برگرداندن خطا به کلاینت به صورت قابل فهم
        return NextResponse.json(
            {
                error: "Failed to fetch posts",
                details: error.message || "Unknown error" // جزئیات خطا
            },
            { status: 500 }
        );
    }
}