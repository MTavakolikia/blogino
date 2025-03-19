import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

export async function POST(request: Request) {
    try {
        const { title, content, authorId } = await request.json();

        if (!title || !content || !authorId) {
            return NextResponse.json(
                {
                    error: "Missing required fields",
                    details: "Title, content, and authorId are required",
                },
                { status: 400 }
            );
        }

        const author = await prisma.user.findUnique({
            where: { id: authorId },
        });

        if (!author) {
            return NextResponse.json(
                {
                    error: "Author not found",
                    details: "The specified author does not exist",
                },
                { status: 404 }
            );
        }

        const post = await prisma.post.create({
            data: {
                title,
                content,
                published: false,
                authorId,
            },
        });

        return NextResponse.json(post, { status: 201 });
    } catch (error) {
        console.error("Error during post creation:", error);
        return NextResponse.json(
            {
                error: "Failed to create post",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = Number(searchParams.get("page")) || 1;
        const limit = Number(searchParams.get("limit")) || 6;
        const category = searchParams.get("category");

        const skip = (page - 1) * limit;

        const where = {
            published: true,
            ...(category && { categoryId: category }),
        };

        const [posts, total] = await Promise.all([
            prisma.post.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
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
            }),
            prisma.post.count({ where }),
        ]);

        return NextResponse.json({
            posts: posts.map(post => ({
                ...post,
                createdAt: post.createdAt.toISOString(),
                updatedAt: post.updatedAt.toISOString(),
                approvedAt: post.approvedAt?.toISOString() || null,
            })),
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        console.error("Error fetching posts:", error);
        return NextResponse.json(
            { error: "Failed to fetch posts" },
            { status: 500 }
        );
    }
}
