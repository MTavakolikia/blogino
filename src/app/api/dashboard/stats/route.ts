import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

export async function GET() {
    try {
        const totalPosts = await prisma.post.count();
        const publishedPosts = await prisma.post.count({ where: { published: true } });
        const draftPosts = totalPosts - publishedPosts;
        const totalCategories = await prisma.category.count();
        const totalUsers = await prisma.user.count();
        const totalComments = await prisma.comment.count();
        const totalLikes = await prisma.like.count();

        return NextResponse.json({
            totalPosts,
            publishedPosts,
            draftPosts,
            totalCategories,
            totalUsers,
            totalComments,
            totalLikes
        }, { status: 200 });

    } catch (error) {
        console.error("Error fetching dashboard stats:", error);

        // **🔹 رفع مشکل ارسال مقدار null**
        return NextResponse.json({ error: "Failed to fetch stats", details: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
    }
}
