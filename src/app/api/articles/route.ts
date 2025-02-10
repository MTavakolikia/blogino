import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/utils/prisma";

export async function POST(request: Request) {
    try {
        const { title, content, authorId } = await request.json();

        // Validate the request body
        if (!title || !content || !authorId) {
            return NextResponse.json(
                {
                    error: "Missing required fields",
                    details: "Title, content, and authorId are required",
                },
                { status: 400 }
            );
        }

        // Create the article
        const article = await prisma.article.create({
            data: {
                title,
                content,
            },
        });

        revalidatePath("/");
        return NextResponse.json(article, { status: 201 });
    } catch (error) {
        console.error("Error creating article:", error);
        return NextResponse.json(
            {
                error: "Failed to create article",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}