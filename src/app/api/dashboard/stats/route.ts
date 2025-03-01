import { prisma } from "@/utils/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const [publishedPosts, draftPosts, categories, totalLikes, totalComments, recentPosts] =
            await Promise.all([
                prisma.post.count({ where: { published: true } }),
                prisma.post.count({ where: { published: false } }),
                prisma.category.count(),
                prisma.post.aggregate({ _sum: { likes: true } }),
                prisma.comment.count(),
                prisma.post.findMany({
                    where: { published: true },
                    orderBy: { createdAt: "desc" },
                    take: 5,
                    select: { title: true, createdAt: true, likes: true },
                }),
            ]);

        const postsByDay = await prisma.post.groupBy({
            by: ["createdAt"],
            _count: { id: true },
            orderBy: { createdAt: "asc" },
        });

        const formattedPostsByDay = postsByDay.map((p) => ({
            date: p.createdAt.toISOString().split("T")[0],
            count: p._count.id,
        }));

        return NextResponse.json({
            posts: { published: publishedPosts, drafts: draftPosts },
            categories,
            totalLikes: totalLikes._sum.likes || 0,
            totalComments,
            recentPosts,
            postsByDay: formattedPostsByDay,
        });
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
    }
}
