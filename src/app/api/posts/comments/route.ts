import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";
import { authenticateAPI, AuthenticatedRequest } from "@/utils/apiAuth";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const postId = searchParams.get("postId");

        if (!postId) {
            return NextResponse.json({ error: "Post ID is required." }, { status: 400 });
        }

        const comments = await prisma.comment.findMany({
            where: { postId, parentId: null },
            include: {
                user: { select: { firstName: true, lastName: true, profilePic: true } },
                replies: {
                    include: {
                        user: { select: { firstName: true, lastName: true, profilePic: true } },
                    },
                    orderBy: { createdAt: "asc" },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(comments, { status: 200 });
    } catch (error) {
        console.error("Error fetching comments:", error);
        return NextResponse.json({ error: "Error fetching comments" }, { status: 500 });
    }
}

export async function POST(req: AuthenticatedRequest) {
    try {
        const authError = await authenticateAPI(req);
        if (authError) return authError;

        const { content, postId, parentId } = await req.json();

        if (!content || !postId) {
            return NextResponse.json({ error: "Incomplete information." }, { status: 400 });
        }

        const post = await prisma.post.findUnique({ where: { id: postId } });
        if (!post) {
            return NextResponse.json({ error: "Post not found." }, { status: 404 });
        }

        // The commenter is always the authenticated user — never from the client.
        const newComment = await prisma.comment.create({
            data: {
                content,
                postId,
                userId: req.user!.id,
                parentId: parentId || null,
                approved: true,
            },
        });

        return NextResponse.json(newComment, { status: 201 });
    } catch (error) {
        console.error("Error creating comment:", error);
        return NextResponse.json({ error: "An error occurred." }, { status: 500 });
    }
}
