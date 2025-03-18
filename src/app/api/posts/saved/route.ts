import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";
import { cookies } from "next/headers";

export async function GET() {
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

        const savedPosts = await prisma.savedPost.findMany({
            where: {
                userId: user.id
            },
            include: {
                post: {
                    include: {
                        author: {
                            select: {
                                firstName: true,
                                lastName: true,
                            },
                        },
                        category: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        return NextResponse.json(savedPosts.map(sp => sp.post), { status: 200 });
    } catch (error) {
        console.error("Error fetching saved posts:", error);
        return NextResponse.json(
            { error: "Failed to fetch saved posts" },
            { status: 500 }
        );
    }
}

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

        // Check if post exists
        const post = await prisma.post.findUnique({
            where: { id: postId }
        });

        if (!post) {
            return NextResponse.json(
                { error: "Post not found" },
                { status: 404 }
            );
        }

        // Check if already saved
        const existingSavedPost = await prisma.savedPost.findFirst({
            where: {
                userId: user.id,
                postId: postId
            }
        });

        if (existingSavedPost) {
            return NextResponse.json(
                { error: "Post already saved" },
                { status: 400 }
            );
        }

        const savedPost = await prisma.savedPost.create({
            data: {
                userId: user.id,
                postId: postId
            }
        });

        return NextResponse.json(savedPost, { status: 201 });
    } catch (error) {
        console.error("Error saving post:", error);
        return NextResponse.json(
            { error: "Failed to save post" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
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

        const savedPost = await prisma.savedPost.findFirst({
            where: {
                userId: user.id,
                postId: postId
            }
        });

        if (!savedPost) {
            return NextResponse.json(
                { error: "Saved post not found" },
                { status: 404 }
            );
        }

        await prisma.savedPost.delete({
            where: {
                id: savedPost.id
            }
        });

        return NextResponse.json(
            { message: "Post removed from saved posts" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error removing saved post:", error);
        return NextResponse.json(
            { error: "Failed to remove saved post" },
            { status: 500 }
        );
    }
}