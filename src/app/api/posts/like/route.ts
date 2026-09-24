import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";
import { authenticateAPI, AuthenticatedRequest } from "@/utils/apiAuth";

export async function GET(request: AuthenticatedRequest) {
    try {
        const authError = await authenticateAPI(request);
        if (authError) return authError;

        const user = request.user!;

        const likedPosts = await prisma.like.findMany({
            where: { userId: user.id },
            include: {
                post: {
                    include: {
                        author: { select: { firstName: true, lastName: true } },
                        category: { select: { name: true } },
                        _count: { select: { likes: true } },
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({
            posts: likedPosts.map((lp) => ({
                ...lp.post,
                likedAt: lp.createdAt,
                createdAt: lp.post.createdAt.toISOString(),
                updatedAt: lp.post.updatedAt.toISOString(),
            })),
        }, { status: 200 });
    } catch (error) {
        console.error("Error fetching liked posts:", error);
        return NextResponse.json({ error: "Failed to fetch liked posts" }, { status: 500 });
    }
}
