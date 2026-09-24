import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";
import { authenticateAPI, AuthenticatedRequest } from "@/utils/apiAuth";

async function getPostLikeCount(postId: string) {
    return prisma.like.count({ where: { postId } });
}

export async function POST(
    request: AuthenticatedRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const authError = await authenticateAPI(request);
        if (authError) return authError;

        const { id } = await params;
        const user = request.user!;

        if (!id) {
            return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
        }

        const post = await prisma.post.findUnique({ where: { id } });

        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        const existingLike = await prisma.like.findFirst({
            where: { userId: user.id, postId: id },
        });

        if (existingLike) {
            await prisma.like.delete({ where: { id: existingLike.id } });
            const likeCount = await getPostLikeCount(id);
            return NextResponse.json({ liked: false, isLiked: false, likeCount }, { status: 200 });
        }

        await prisma.like.create({
            data: { userId: user.id, postId: id },
        });

        const likeCount = await getPostLikeCount(id);
        return NextResponse.json({ liked: true, isLiked: true, likeCount }, { status: 201 });
    } catch (error) {
        console.error("Error handling like:", error);
        return NextResponse.json({ error: "Failed to handle like" }, { status: 500 });
    }
}

export async function GET(
    request: AuthenticatedRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id: postId } = await params;

        // Public: like count is visible to everyone.
        // Authenticated: also tells us whether *they* liked it.
        const authError = await authenticateAPI(request);
        const user = authError ? null : (request.user ?? null);

        if (!postId) {
            return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
        }

        const likeCount = await getPostLikeCount(postId);

        let isLiked = false;
        if (user) {
            const existing = await prisma.like.findFirst({
                where: { userId: user.id, postId },
            });
            isLiked = !!existing;
        }

        return NextResponse.json({ liked: isLiked, isLiked, likeCount }, { status: 200 });
    } catch (error) {
        console.error("Error fetching like status:", error);
        return NextResponse.json({ error: "Failed to fetch like status" }, { status: 500 });
    }
}
