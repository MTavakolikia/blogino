import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/utils/prisma";
import { authenticateAPI, type AuthenticatedRequest } from "@/utils/apiAuth";
import { auditPost, optimizePostFields } from "@/lib/seo";

/**
 * The automated SEO fixer.
 *
 * Body: { postId? } — when `postId` is missing, every post the caller is
 * allowed to touch is optimized in one batch. Writes are minimal: fields
 * that already look good are never overwritten (see `optimizePostFields`).
 */
export async function POST(request: AuthenticatedRequest) {
    try {
        const authError = await authenticateAPI(request, ["ADMIN", "AUTHOR"]);
        if (authError) return authError;

        const body = await request.json().catch(() => ({}));
        const isAdmin = request.user!.role === "ADMIN";

        const target = body.postId
            ? await prisma.post.findFirst({
                  where: isAdmin
                      ? { id: String(body.postId) }
                      : {
                            OR: [
                                { id: String(body.postId) },
                                { authorId: request.user!.id },
                            ],
                        },
              })
            : null;

        if (body.postId && !target) {
            return NextResponse.json(
                { error: "Post not found" },
                { status: 404 },
            );
        }

        const posts = target
            ? [target]
            : await prisma.post.findMany({
                  where: isAdmin ? {} : { authorId: request.user!.id },
              });

        const takenSlugs = (
            await prisma.post.findMany({
                where: { slug: { not: null } },
                select: { slug: true },
            })
        )
            .map((p) => p.slug)
            .filter((s): s is string => Boolean(s));

        const results: {
            postId: string;
            title: string;
            before: number;
            after: number;
            fields: string[];
        }[] = [];

        for (const post of posts) {
            const fields = optimizePostFields(post, takenSlugs);
            const keys = Object.keys(fields);

            if (keys.length === 0) {
                const before = auditPost(post).score;
                results.push({
                    postId: post.id,
                    title: post.title,
                    before,
                    after: before,
                    fields: [],
                });
                continue;
            }

            // Reserve generated slugs so later posts in the batch don't collide.
            if (fields.slug) takenSlugs.push(fields.slug);

            await prisma.post.update({
                where: { id: post.id },
                data: fields,
            });

            const after = auditPost({ ...post, ...fields }).score;
            results.push({
                postId: post.id,
                title: post.title,
                before: auditPost(post).score,
                after,
                fields: keys,
            });
        }

        const updated = results.filter((r) => r.fields.length > 0).length;

        return NextResponse.json({
            scanned: posts.length,
            updated,
            results,
        });
    } catch (error) {
        console.error("Error optimizing SEO fields:", error);
        return NextResponse.json(
            {
                error: "Failed to optimize SEO fields",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 },
        );
    }
}
