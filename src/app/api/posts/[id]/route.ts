import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";
import { authenticateAPI, AuthenticatedRequest } from "@/utils/apiAuth";

export async function PUT(
    request: AuthenticatedRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const authError = await authenticateAPI(request, ["ADMIN", "AUTHOR"]);
        if (authError) return authError;

        const { title, content, published, categoryId, images } = await request.json();
        const { id } = await params;

        if (!title && !content && published === undefined && categoryId === undefined && !images) {
            return NextResponse.json(
                {
                    error: "Missing update fields",
                    details: "At least one field must be provided for update",
                },
                { status: 400 },
            );
        }

        const post = await prisma.post.findUnique({ where: { id } });

        if (!post) {
            return NextResponse.json(
                { error: "Post not found", details: "The specified post does not exist" },
                { status: 404 },
            );
        }

        if (request.user!.role !== "ADMIN" && post.authorId !== request.user!.id) {
            return NextResponse.json(
                { error: "You can only edit your own posts" },
                { status: 403 },
            );
        }

        const updatedPost = await prisma.post.update({
            where: { id },
            data: {
                ...(title ? { title } : {}),
                ...(content ? { content } : {}),
                ...(published !== undefined ? { published } : {}),
                ...(categoryId !== undefined ? { categoryId } : {}),
                ...(Array.isArray(images) ? { images } : {}),
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
            { status: 500 },
        );
    }
}

export async function DELETE(
    request: AuthenticatedRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const authError = await authenticateAPI(request, ["ADMIN", "AUTHOR"]);
        if (authError) return authError;

        const { id: postId } = await params;

        const post = await prisma.post.findUnique({ where: { id: postId } });

        if (!post) {
            return NextResponse.json(
                { error: "Post not found", details: "The specified post does not exist" },
                { status: 404 },
            );
        }

        if (request.user!.role !== "ADMIN" && post.authorId !== request.user!.id) {
            return NextResponse.json(
                { error: "You can only delete your own posts" },
                { status: 403 },
            );
        }

        await prisma.post.delete({ where: { id: postId } });

        return NextResponse.json({ message: "Post deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting post:", error);
        return NextResponse.json(
            {
                error: "Failed to delete post",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 },
        );
    }
}

export async function GET(
    request: AuthenticatedRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params;

        // Authenticated authors can see their own drafts, admins see
        // everything; unauthenticated visitors only get published posts.
        const authError = await authenticateAPI(request);
        const user = authError ? null : (request.user ?? null);

        const where = user
            ? {
                  id,
                  ...(user.role !== "ADMIN" && {
                      OR: [{ published: true }, { authorId: user.id }],
                  }),
              }
            : { id, published: true };

        const post = await prisma.post.findFirst({
            where,
            include: {
                category: { select: { name: true } },
                author: { select: { firstName: true, lastName: true } },
                _count: { select: { likes: true } },
            },
        });

        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        return NextResponse.json(
            {
                ...post,
                createdAt: post.createdAt.toISOString(),
                updatedAt: post.updatedAt.toISOString(),
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("Error fetching post by ID:", error);
        return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
    }
}
