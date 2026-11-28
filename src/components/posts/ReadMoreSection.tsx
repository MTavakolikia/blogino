import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { prisma } from "@/utils/prisma";
import PostCover from "@/components/posts/PostCover";
import { postPath } from "@/lib/seo";

interface ReadMoreSectionProps {
    currentPostId: string;
    currentCategoryId: string | null;
}

/**
 * "Read more" — 3 related articles (same category first, then newest).
 * Rendered as a server component so it can query the database directly.
 */
export async function ReadMoreSection({
    currentPostId,
    currentCategoryId,
}: ReadMoreSectionProps) {
    const [sameCategory, recent] = await Promise.all([
        prisma.post.findMany({
            where: {
                id: { not: currentPostId },
                published: true,
                ...(currentCategoryId ? { categoryId: currentCategoryId } : {}),
            },
            orderBy: { createdAt: "desc" },
            take: 3,
            select: {
                id: true,
                title: true,
                images: true,
                createdAt: true,
                slug: true,
                category: { select: { name: true } },
            },
        }),
        prisma.post.findMany({
            where: { id: { not: currentPostId }, published: true },
            orderBy: { createdAt: "desc" },
            take: 3,
            select: {
                id: true,
                title: true,
                images: true,
                createdAt: true,
                slug: true,
                category: { select: { name: true } },
            },
        }),
    ]);

    const related = [
        ...sameCategory,
        ...recent.filter((r) => !sameCategory.some((s) => s.id === r.id)),
    ].slice(0, 3);

    if (related.length === 0) return null;

    return (
        <section className="mt-14 border-t border-border pt-10">
            <h2 className="mb-8 text-2xl font-semibold tracking-tight">
                Read more
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                {related.map((post) => (
                    <Link
                        key={post.id}
                        href={postPath(post)}
                        className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-card transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
                    >
                        <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
                            <PostCover
                                src={post.images[0]}
                                alt={post.title}
                                label={post.category?.name}
                                sizes="(max-width: 640px) 100vw, 33vw"
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
                        </div>
                        <div className="flex flex-1 flex-col gap-2 p-5">
                            {post.category && (
                                <span className="text-xs font-medium text-primary">
                                    {post.category.name}
                                </span>
                            )}
                            <h3 className="line-clamp-2 flex-1 text-base font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary">
                                {post.title}
                            </h3>
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                {new Date(post.createdAt).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                })}
                                <ArrowUpRight className="ml-auto h-3.5 w-3.5 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
