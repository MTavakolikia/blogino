import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";
import { authenticateAPI, AuthenticatedRequest } from "@/utils/apiAuth";

function requireUser(request: AuthenticatedRequest) {
    return request.user ?? null;
}

export async function GET(request: AuthenticatedRequest) {
    try {
        const authError = await authenticateAPI(request);
        if (authError) return authError;

        const user = requireUser(request)!;

        const savedPosts = await prisma.savedPost.findMany({
            where: { userId: user.id },
            include: {
                post: {
                    include: {
                        author: { select: { firstName: true, lastName: true } },
                        category: { select: { name: true } },
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(
            savedPosts.map((sp) => ({
                ...sp.post,
                savedAt: sp.createdAt,
                createdAt: sp.post.createdAt.toISOString(),
                updatedAt: sp.post.updatedAt.toISOString(),
            })),
            { status: 200 },
        );
    } catch (error) {
        console.error("Error fetching saved posts:", error);
        return NextResponse.json({ error: "Failed to fetch saved posts" }, { status: 500 });
    }
}

export async function POST(request: AuthenticatedRequest) {
    try {
        const authError = await authenticateAPI(request);
        if (authError) return authError;

        const user = requireUser(request)!;
        const { postId } = await request.json();

        if (!postId) {
            return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
        }

        const post = await prisma.post.findUnique({ where: { id: postId } });

        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        const existingSavedPost = await prisma.savedPost.findFirst({
            where: { userId: user.id, postId },
        });

        if (existingSavedPost) {
            return NextResponse.json({ error: "Post already saved" }, { status: 400 });
        }

        const savedPost = await prisma.savedPost.create({
            data: { userId: user.id, postId },
        });

        return NextResponse.json(savedPost, { status: 201 });
    } catch (error) {
        console.error("Error saving post:", error);
        return NextResponse.json({ error: "Failed to save post" }, { status: 500 });
    }
}

export async function DELETE(request: AuthenticatedRequest) {
    try {
        const authError = await authenticateAPI(request);
        if (authError) return authError;

        const user = requireUser(request)!;
        const { postId } = await request.json();

        if (!postId) {
            return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
        }

        const savedPost = await prisma.savedPost.findFirst({
            where: { userId: user.id, postId },
        });

        if (!savedPost) {
            return NextResponse.json({ error: "Saved post not found" }, { status: 404 });
        }

        await prisma.savedPost.delete({ where: { id: savedPost.id } });

        return NextResponse.json(
            { message: "Post removed from saved posts" },
            { status: 200 },
        );
    } catch (error) {
        console.error("Error removing saved post:", error);
        return NextResponse.json({ error: "Failed to remove saved post" }, { status: 500 });
    }
}
