import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";
import { cookies } from "next/headers";

async function getPostLikeCount(postId: string) {
    return prisma.like.count({
        where: {
            postId,
        },
    });
}

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
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
        const { id } = await params;
        let bodyPostId: string | undefined;

        try {
            const body = await request.json();
            bodyPostId = body.postId;
        } catch {
            bodyPostId = undefined;
        }

        const postId = bodyPostId || id;

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
            const likeCount = await getPostLikeCount(postId);
            return NextResponse.json({ liked: false, isLiked: false, likeCount }, { status: 200 });
        }

        await prisma.like.create({
            data: {
                userId: user.id,
                postId: postId
            }
        });

        const likeCount = await getPostLikeCount(postId);
        return NextResponse.json({ liked: true, isLiked: true, likeCount }, { status: 201 });
    } catch (error) {
        console.error("Error handling like:", error);
        return NextResponse.json(
            { error: "Failed to handle like" },
            { status: 500 }
        );
    }
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const cookieStore = await cookies();
        const userCookie = cookieStore.get("user");
        const { id: postId } = await params;

        if (!userCookie) {
            const likeCount = await getPostLikeCount(postId);
            return NextResponse.json({
                liked: false,
                isLiked: false,
                likeCount
            }, { status: 200 });
        }

        const user = JSON.parse(userCookie.value);

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
            isLiked: !!isLiked,
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
