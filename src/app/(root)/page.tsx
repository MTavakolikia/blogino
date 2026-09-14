import { prisma } from "@/utils/prisma";
import PostsExplorer from "@/components/posts/PostsExplorer";
import type { PostCardPost } from "@/components/posts/PostCard";
import type { CategoryOption } from "@/components/posts/CategoryFilter";
import { FlickeringGrid } from "@/components/magicui/flickering-grid";
import { TextReveal } from "@/components/magicui/text-reveal";
import { NumberTicker } from "@/components/magicui/number-ticker";
import StartReadingButton from "@/components/root/StartReadingButton";
import Link from "next/link";

export const dynamic = "force-dynamic";

const POSTS_PER_PAGE = 12;

async function getLatestPosts() {
    const posts = await prisma.post.findMany({
        where: { published: true },
        orderBy: { createdAt: "desc" },
        take: POSTS_PER_PAGE,
        include: {
            author: { select: { firstName: true, lastName: true } },
            category: { select: { name: true } },
            _count: { select: { likes: true } },
        },
    });

    return posts.map((post) => ({
        id: post.id,
        title: post.title,
        content: post.content,
        images: post.images,
        createdAt: post.createdAt.toISOString(),
        author: post.author,
        category: post.category,
        _count: post._count,
    })) as PostCardPost[];
}

async function getCategories(): Promise<CategoryOption[]> {
    const categories = await prisma.category.findMany({
        orderBy: { name: "asc" },
        include: {
            _count: {
                select: {
                    posts: { where: { published: true } },
                },
            },
        },
    });
    return categories.map((c) => ({
        id: c.id,
        name: c.name,
        count: c._count.posts,
    }));
}

async function getTotals() {
    const [posts, authors] = await Promise.all([
        prisma.post.count({ where: { published: true } }),
        prisma.user.count({ where: { role: "AUTHOR" } }),
    ]);
    return { posts, authors };
}

export default async function Home() {
    const [latestPosts, categories, totals] = await Promise.all([
        getLatestPosts(),
        getCategories(),
        getTotals(),
    ]);

    return (
        <div className="relative">
            {/* Hero */}
            <div className="relative overflow-hidden border-b border-border/60">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-64 [mask-image:linear-gradient(to_top,transparent_20%,black_90%)]">
                    <FlickeringGrid
                        className="absolute left-0 top-0 size-full"
                        squareSize={4}
                        gridGap={6}
                        color="var(--ring)"
                        maxOpacity={0.16}
                        flickerChance={0.05}
                    />
                </div>

                <div className="relative mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
                    <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        Fresh ideas, every week
                    </p>

                    <h1 className="max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tighter md:text-6xl">
                        <TextReveal text="Read the ideas that" />{" "}
                        <span className="bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">
                            <TextReveal text="shape the web." delay={0.4} />
                        </span>
                    </h1>

                    <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
                        In-depth articles on technology, programming, design,
                        business and science — written to be read, not skimmed.
                    </p>

                    <div className="mt-8 flex flex-wrap items-center gap-4">
                        <StartReadingButton />
                        <div className="flex items-center gap-6">
                            <div>
                                <NumberTicker
                                    value={totals.posts}
                                    className="text-2xl font-semibold tabular-nums tracking-tight"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Articles
                                </p>
                            </div>
                            <div className="h-8 w-px bg-border" />
                            <div>
                                <NumberTicker
                                    value={categories.length}
                                    className="text-2xl font-semibold tabular-nums tracking-tight"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Categories
                                </p>
                            </div>
                            <div className="h-8 w-px bg-border" />
                            <div>
                                <NumberTicker
                                    value={totals.authors}
                                    className="text-2xl font-semibold tabular-nums tracking-tight"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Authors
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Latest posts */}
            <div
                id="latest"
                className="mx-auto max-w-7xl scroll-mt-20 px-4 py-10 md:px-6 md:py-14"
            >
                <div className="mb-6 flex items-end justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                            Latest articles
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            The newest from every corner of the blog.
                        </p>
                    </div>
                    <Link
                        href="/post"
                        className="hidden shrink-0 text-sm font-medium text-primary hover:underline underline-offset-4 sm:block"
                    >
                        View all →
                    </Link>
                </div>

                <PostsExplorer
                    initialPosts={latestPosts}
                    categories={categories}
                />

                <div className="mt-10 flex justify-center sm:hidden">
                    <Link
                        href="/post"
                        className="text-sm font-medium text-primary"
                    >
                        View all articles →
                    </Link>
                </div>
            </div>
        </div>
    );
}
