import { prisma } from "@/utils/prisma";
import Link from "next/link";
import PostsPageClient from "@/components/posts/PostsPageClient";
import type { PostCardPost } from "@/components/posts/PostCard";
import type { CategoryOption } from "@/components/posts/CategoryFilter";
import { FlickeringGrid } from "@/components/magicui/flickering-grid";

export const dynamic = "force-dynamic";

const POSTS_PER_PAGE = 9;

type PostRow = {
    id: string;
    title: string;
    content: string;
    images: string[];
    createdAt: Date;
    author: { firstName: string; lastName: string };
    category: { name: string } | null;
    _count: { likes: number };
};

function toCard(p: PostRow): PostCardPost {
    return {
        id: p.id,
        title: p.title,
        content: p.content,
        images: p.images,
        createdAt: p.createdAt.toISOString(),
        author: p.author,
        category: p.category,
        _count: p._count,
    };
}

async function getCategories(): Promise<CategoryOption[]> {
    const categories = await prisma.category.findMany({
        orderBy: { name: "asc" },
        include: {
            _count: { select: { posts: { where: { published: true } } } },
        },
    });
    return categories.map((c) => ({
        id: c.id,
        name: c.name,
        count: c._count.posts,
    }));
}

async function getPosts(page: number, categoryId: string | null) {
    const skip = (page - 1) * POSTS_PER_PAGE;
    const where = {
        published: true as const,
        ...(categoryId ? { categoryId } : {}),
    };

    const [posts, total] = await Promise.all([
        prisma.post.findMany({
            where,
            skip,
            take: POSTS_PER_PAGE,
            orderBy: { createdAt: "desc" },
            include: {
                author: { select: { firstName: true, lastName: true } },
                category: { select: { name: true } },
                _count: { select: { likes: true } },
            },
        }),
        prisma.post.count({ where }),
    ]);

    return {
        posts: (posts as PostRow[]).map(toCard),
        totalPages: Math.max(1, Math.ceil(total / POSTS_PER_PAGE)),
    };
}

async function getSidebar() {
    const [recent, popular] = await Promise.all([
        prisma.post.findMany({
            where: { published: true },
            orderBy: { createdAt: "desc" },
            take: 5,
            select: { id: true, title: true, createdAt: true },
        }),
        prisma.post.findMany({
            where: { published: true },
            orderBy: { views: "desc" },
            take: 5,
            select: { id: true, title: true, views: true },
        }),
    ]);
    return { recent, popular };
}

export default async function PostPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; category?: string }>;
}) {
    const params = await searchParams;
    const page = Math.max(1, Number(params.page) || 1);
    const categoryId = params.category || null;

    const [categories, { posts, totalPages }, sidebar] = await Promise.all([
        getCategories(),
        getPosts(page, categoryId),
        getSidebar(),
    ]);

    const activeName =
        categoryId != null
            ? categories.find((c) => c.id === categoryId)?.name
            : null;

    return (
        <div className="relative">
            <div className="border-b border-border/60">
                <div className="relative mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
                    <div className="pointer-events-none absolute inset-0 -top-8 h-40 [mask-image:linear-gradient(to_top,transparent_20%,black_90%)]">
                        <FlickeringGrid
                            className="absolute left-0 top-0 size-full"
                            squareSize={4}
                            gridGap={6}
                            color="var(--ring)"
                            maxOpacity={0.12}
                            flickerChance={0.05}
                        />
                    </div>
                    <div className="relative">
                        <h1 className="text-3xl font-semibold tracking-tighter md:text-4xl">
                            {activeName ?? "All articles"}
                        </h1>
                        <p className="mt-2 text-sm text-muted-foreground">
                            {activeName
                                ? `Everything tagged ${activeName}.`
                                : "Browse the full archive of articles."}
                        </p>
                    </div>
                </div>
            </div>

            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-10 md:px-6 lg:grid-cols-[1fr_300px]">
                <div className="min-w-0">
                    <PostsPageClient
                        initialPosts={posts}
                        categories={categories}
                        totalPages={totalPages}
                        currentPage={page}
                        selectedCategory={categoryId}
                        perPage={POSTS_PER_PAGE}
                    />
                </div>

                {/* Desktop sidebar */}
                <aside className="hidden lg:block">
                    <div className="sticky top-24 space-y-6">
                        <div className="rounded-2xl border border-border/70 bg-card p-6">
                            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                                Recent
                            </h3>
                            <ul className="mt-4 space-y-4">
                                {sidebar.recent.map((p) => (
                                    <li key={p.id}>
                                        <Link
                                            href={`/post/${p.id}`}
                                            className="line-clamp-2 text-sm font-medium text-foreground/85 transition-colors hover:text-primary"
                                        >
                                            {p.title}
                                        </Link>
                                        <p className="mt-0.5 text-xs text-muted-foreground">
                                            {new Date(p.createdAt).toLocaleDateString()}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="rounded-2xl border border-border/70 bg-muted/30 p-6">
                            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                                Most viewed
                            </h3>
                            <ul className="mt-4 space-y-3">
                                {sidebar.popular.map((p, i) => (
                                    <li key={p.id} className="flex gap-3">
                                        <span className="text-lg font-semibold tabular-nums text-muted-foreground/50">
                                            {i + 1}
                                        </span>
                                        <Link
                                            href={`/post/${p.id}`}
                                            className="line-clamp-2 flex-1 text-sm text-foreground/85 transition-colors hover:text-primary"
                                        >
                                            {p.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
