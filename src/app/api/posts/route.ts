import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";
import { authenticateAPI, AuthenticatedRequest } from "@/utils/apiAuth";
import {
    SEO,
    describePost,
    slugify,
    truncateText,
} from "@/lib/seo";

export async function POST(request: AuthenticatedRequest) {
    try {
        const authError = await authenticateAPI(request, ["ADMIN", "AUTHOR"]);
        if (authError) return authError;

        const {
            title,
            content,
            categoryId,
            image,
            images,
            slug,
            excerpt,
            metaTitle,
            metaDescription,
        } = await request.json();

        if (!title || !content) {
            return NextResponse.json(
                {
                    error: "Missing required fields",
                    details: "Title and content are required",
                },
                { status: 400 },
            );
        }

        // SEO automation: slug and meta description are derived from the
        // title/content when the author didn't provide them, so every post
        // gets a readable URL and a search-friendly description.
        let postSlug: string | null = String(slug ?? "").trim() || null;
        if (postSlug) postSlug = slugify(postSlug);

        const cleanExcerpt = String(excerpt ?? "").trim() || null;
        const cleanMetaTitle = String(metaTitle ?? "").trim() || null;
        const cleanMetaDescription = String(metaDescription ?? "").trim();

        const autoMetaDescription = cleanMetaDescription
            ? cleanMetaDescription
            : describePost({ title, excerpt: cleanExcerpt, content });

        // Author is always the authenticated user — never trusted from the client.
        const post = await prisma.post.create({
            data: {
                title,
                content,
                published: false,
                authorId: request.user!.id,
                categoryId: categoryId || null,
                images: Array.isArray(images) ? images : image ? [image] : [],
                slug: postSlug,
                excerpt: cleanExcerpt,
                metaTitle: cleanMetaTitle ?? truncateText(title, SEO.TITLE_MAX),
                metaDescription: autoMetaDescription,
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
            { status: 500 },
        );
    }
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = Number(searchParams.get("page")) || 1;
        const limit = Number(searchParams.get("limit")) || 6;
        const category = searchParams.get("category");
        const q = searchParams.get("q")?.trim();
        const sort = searchParams.get("sort");

        const skip = (page - 1) * limit;

        // Text search covers the title and the author-written excerpt —
        // the full body is intentionally excluded to keep the query cheap.
        const where = {
            published: true,
            ...(category && { categoryId: category }),
            ...(q && {
                OR: [
                    { title: { contains: q, mode: "insensitive" as const } },
                    { excerpt: { contains: q, mode: "insensitive" as const } },
                ],
            }),
        };

        const orderBy =
            sort === "popular"
                ? { views: "desc" as const }
                : sort === "oldest"
                    ? { createdAt: "asc" as const }
                    : { createdAt: "desc" as const };

        const [posts, total] = await Promise.all([
            prisma.post.findMany({
                where,
                skip,
                take: limit,
                orderBy,
                include: {
                    author: { select: { firstName: true, lastName: true } },
                    category: { select: { name: true } },
                    _count: { select: { likes: true } },
                },
            }),
            prisma.post.count({ where }),
        ]);

        return NextResponse.json({
            posts: posts.map((post) => ({
                ...post,
                createdAt: post.createdAt.toISOString(),
                updatedAt: post.updatedAt.toISOString(),
                approvedAt: post.approvedAt?.toISOString() || null,
            })),
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        console.error("Error fetching posts:", error);
        return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
    }
}
