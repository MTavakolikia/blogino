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

        const likedPosts = await prisma.like.findMany({
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
                        _count: {
                            select: {
                                likes: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        return NextResponse.json({
            posts: likedPosts.map(lp => ({
                ...lp.post,
                _count: lp.post._count
            }))
        }, { status: 200 });
    } catch (error) {
        console.error("Error fetching liked posts:", error);
        return NextResponse.json(
            { error: "Failed to fetch liked posts" },
            { status: 500 }
        );
    }
}