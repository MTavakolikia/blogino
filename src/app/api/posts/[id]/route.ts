import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

export async function PUT(request: Request, {
    params,
}: {
    params: Promise<{ id: string }>
}) {
    try {
        const { title, content, published } = await request.json();
        const { id } = await params;

        if (!title && !content && published === undefined) {
            return NextResponse.json(
                {
                    error: "Missing update fields",
                    details: "At least one field must be provided for update",
                },
                { status: 400 }
            );
        }

        const post = await prisma.post.findUnique({
            where: { id },
        });

        if (!post) {
            return NextResponse.json(
                {
                    error: "Post not found",
                    details: "The specified post does not exist",
                },
                { status: 404 }
            );
        }
        const updatedPost = await prisma.post.update({
            where: { id },
            data: {
                title: title || post.title,
                content: content || post.content,
                published: published !== undefined ? published : post.published,
            },
        });

        return NextResponse.json(updatedPost, { status: 200 });
    } catch (error) {
        console.error("Error updating post:", error);
        return NextResponse.json(
            {
                error: "Failed to update post",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}


export async function DELETE(request: Request, {
    params,
}: {
    params: Promise<{ id: string }>
}) {
    try {
        const { id: postId } = await params;

        const post = await prisma.post.findUnique({
            where: { id: postId },
        });

        if (!post) {
            return NextResponse.json(
                {
                    error: "Post not found",
                    details: "The specified post does not exist",
                },
                { status: 404 }
            );
        }

        await prisma.post.delete({
            where: { id: postId },
        });

        return NextResponse.json({ message: "Post deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting post:", error);
        return NextResponse.json(
            {
                error: "Failed to delete post",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}



export async function GET(
    request: Request,
    {
        params,
    }: {
        params: Promise<{ id: string }>
    }
) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
        }

        const post = await prisma.post.findUnique({
            where: { id },
            include: {
                category: { select: { name: true } },
                author: { select: { firstName: true, lastName: true } }
            },
        });

        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        return NextResponse.json(post, { status: 200 });
    } catch (error) {
        console.error("Error fetching post by ID:", error);
        return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
    }
}

