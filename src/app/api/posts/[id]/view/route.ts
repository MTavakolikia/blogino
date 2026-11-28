import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/utils/prisma";

const COOKIE_NAME = "blogino_viewed";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days
const MAX_TRACKED = 100;

/**
 * Record a view for a post (by id or slug). A per-browser cookie prevents
 * the same visitor from inflating the counter repeatedly; each new view
 * also writes a PostView row so the dashboard can chart it over time.
 */
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params;

        const post = await prisma.post.findFirst({
            where: { OR: [{ id }, { slug: id }], published: true },
            select: { id: true, views: true },
        });

        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        const raw = request.cookies.get(COOKIE_NAME)?.value ?? "";
        const viewed = raw ? raw.split(",").filter(Boolean) : [];

        if (viewed.includes(post.id)) {
            return NextResponse.json({ views: post.views, alreadyViewed: true });
        }

        await prisma.postView.create({ data: { postId: post.id } });
        await prisma.post.update({
            where: { id: post.id },
            data: { views: { increment: 1 } },
        });

        const next = [...viewed, post.id].slice(-MAX_TRACKED).join(",");
        const response = NextResponse.json({
            views: post.views + 1,
            alreadyViewed: false,
        });
        response.cookies.set(COOKIE_NAME, next, {
            httpOnly: true,
            sameSite: "lax",
            path: "/",
            maxAge: COOKIE_MAX_AGE,
        });
        return response;
    } catch (error) {
        console.error("Error recording post view:", error);
        return NextResponse.json(
            {
                error: "Failed to record view",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 },
        );
    }
}
