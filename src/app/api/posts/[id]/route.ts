import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        const { title, content, published } = await request.json();
        const postId = params.id;

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
        const updatedPost = await prisma.post.update({
            where: { id: postId },
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


export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const postId = params.id;

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