import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";
import { cookies } from "next/headers";

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const userCookie = cookieStore.get("user");

        if (!userCookie) {
            return NextResponse.json(
                { error: "User not authenticated" },
                { status: 401 }
            );
        }

        const user = JSON.parse(userCookie.value);
        const { postId } = await request.json();

        if (!postId) {
            return NextResponse.json(
                { error: "Post ID is required" },
                { status: 400 }
            );
        }

        const post = await prisma.post.findUnique({
            where: { id: postId }
        });

        if (!post) {
            return NextResponse.json(
                { error: "Post not found" },
                { status: 404 }
            );
        }

        const existingLike = await prisma.like.findFirst({
            where: {
                userId: user.id,
                postId: postId
            }
        });

        if (existingLike) {
            await prisma.like.delete({
                where: {
                    id: existingLike.id
                }
            });
            return NextResponse.json({ liked: false }, { status: 200 });
        }

        await prisma.like.create({
            data: {
                userId: user.id,
                postId: postId
            }
        });

        return NextResponse.json({ liked: true, likeCount: 1 }, { status: 201 });
    } catch (error) {
        console.error("Error handling like:", error);
        return NextResponse.json(
            { error: "Failed to handle like" },
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    try {
        const cookieStore = await cookies();
        const userCookie = cookieStore.get("user");

        if (!userCookie) {
            return NextResponse.json(
                { error: "User not authenticated" },
                { status: 401 }
            );
        }

        const user = JSON.parse(userCookie.value);
        const { searchParams } = new URL(request.url);
        const postId = searchParams.get("postId");

        if (!postId) {
            return NextResponse.json(
                { error: "Post ID is required" },
                { status: 400 }
            );
        }

        const [isLiked, likeCount] = await Promise.all([
            prisma.like.findFirst({
                where: {
                    userId: user.id,
                    postId: postId
                }
            }),
            prisma.like.count({
                where: {
                    postId: postId
                }
            })
        ]);

        return NextResponse.json({
            liked: !!isLiked,
            likeCount
        }, { status: 200 });
    } catch (error) {
        console.error("Error fetching like status:", error);
        return NextResponse.json(
            { error: "Failed to fetch like status" },
            { status: 500 }
        );
    }
} 