import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/utils/prisma";
import { authenticateAPI, type AuthenticatedRequest } from "@/utils/apiAuth";
import {
    SEO,
    describePost,
    slugify,
    stripHtml,
    truncateText,
} from "@/lib/seo";

/**
 * Suggest SEO fields for a post draft before saving.
 * Body: { title, content, excerpt?, slug?, metaTitle? }
 */
export async function POST(request: AuthenticatedRequest) {
    try {
        const authError = await authenticateAPI(request, ["ADMIN", "AUTHOR"]);
        if (authError) return authError;

        const body = await request.json().catch(() => null);
        const title = String(body?.title ?? "").trim();
        const content = String(body?.content ?? "");

        if (!title || !content) {
            return NextResponse.json(
                { error: "Title and content are required" },
                { status: 400 },
            );
        }

        const excerpt =
            String(body?.excerpt ?? "").trim() ||
            truncateText(stripHtml(content).slice(0, SEO.EXCERPT_MAX * 2), SEO.EXCERPT_MAX);

        let slug = String(body?.slug ?? "").trim() || slugify(title);
        const taken = (
            await prisma.post.findMany({
                where: { NOT: { id: body?.postId ?? "" } },
                select: { slug: true },
            })
        ).map((p) => p.slug).filter((s): s is string => Boolean(s));

        let suffix = 2;
        while (taken.includes(slug)) {
            slug = `${slugify(title)}-${suffix++}`;
        }

        return NextResponse.json({
            slug,
            excerpt,
            metaTitle:
                String(body?.metaTitle ?? "").trim() ||
                truncateText(title, SEO.TITLE_MAX),
            metaDescription:
                String(body?.metaDescription ?? "")
                    .trim() ||
                describePost({ title, excerpt, content }),
        });
    } catch (error) {
        console.error("Error generating SEO preview:", error);
        return NextResponse.json(
            {
                error: "Failed to generate SEO fields",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 },
        );
    }
}
