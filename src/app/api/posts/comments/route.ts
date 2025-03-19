import { prisma } from "@/utils/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const postId = searchParams.get("postId");

        if (!postId) {
            return NextResponse.json({ error: "Post ID is required." }, { status: 400 });
        }

        const comments = await prisma.comment.findMany({
            where: { postId, parentId: null }, // Only get parent comments
            include: {
                user: { select: { firstName: true, lastName: true, profilePic: true } },
                replies: {
                    include: {
                        user: { select: { firstName: true, lastName: true, profilePic: true } },
                    },
                },
            },
        });

        return NextResponse.json(comments, { status: 200 });
    } catch (error) {
        console.error("Error fetching comments:", error);
        return NextResponse.json({ error: "Error fetching comments" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { content, postId, userId, parentId } = await req.json();

        if (!content || !postId || !userId) {
            return NextResponse.json({ error: "Incomplete information." }, { status: 400 });
        }

        const newComment = await prisma.comment.create({
            data: {
                content,
                postId,
                userId,
                parentId, // If parentId exists, it's a "reply"
            },
        });

        return NextResponse.json(newComment, { status: 201 });
    } catch (error) {
        console.error("Error creating comment:", error);
        return NextResponse.json({ error: "An error occurred." }, { status: 500 });
    }
}
