import { prisma } from "@/utils/prisma";
import { withDatabaseFallback } from "@/utils/db-errors";
import { readingTime } from "@/utils/posts";
import DatabaseUnavailable from "@/components/root/DatabaseUnavailable";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, Eye } from "lucide-react";

import PostContent from "@/components/posts/PostContent";
import PostCover from "@/components/posts/PostCover";
import LikeButton from "@/components/posts/LikeButton";
import SavePostButton from "@/components/posts/SavePostButton";
import ShareButtons from "@/components/posts/ShareButtons";
import CommentsSection from "@/components/posts/CommentsSection";
import { AuthorCard } from "@/components/posts/AuthorCard";
import { ReadMoreSection } from "@/components/posts/ReadMoreSection";
import ReadMoreSkeleton from "@/components/skeletons/ReadMoreSkeleton";
import { BorderBeam } from "@/components/magicui/border-beam";
import { FlickeringGrid } from "@/components/magicui/flickering-grid";
import { TextReveal } from "@/components/magicui/text-reveal";

export const dynamic = "force-dynamic";

export default async function SinglePostPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const loadPost = () =>
        prisma.post.findFirst({
            where: { id, published: true },
            include: {
                author: {
                    select: { firstName: true, lastName: true, profilePic: true },
                },
                category: { select: { id: true, name: true } },
                _count: { select: { likes: true } },
            },
        });

    const post = await withDatabaseFallback<
        "unavailable" | Awaited<ReturnType<typeof loadPost>>
    >("post:findFirst", "unavailable", loadPost);

    if (post === "unavailable") {
        return (
            <div className="mx-auto max-w-3xl px-4 py-16">
                <DatabaseUnavailable />
            </div>
        );
    }

    if (!post) notFound();

    const date = new Date(post.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    const minutes = readingTime(post.content);
    const cover = post.images[0];

    return (
        <article className="relative">
            {/* Hero */}
            <div className="relative overflow-hidden border-b border-border/60">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-56 [mask-image:linear-gradient(to_top,transparent_20%,black_90%)]">
                    <FlickeringGrid
                        className="absolute left-0 top-0 size-full"
                        squareSize={4}
                        gridGap={6}
                        color="hsl(var(--ring))"
                        maxOpacity={0.16}
                        flickerChance={0.05}
                    />
                </div>

                <div className="relative mx-auto max-w-3xl px-4 py-8 md:px-6 md:py-12">
                    <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-3 text-sm text-muted-foreground">
                        <Link
                            href="/post"
                            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background/70 text-foreground/70 transition-colors hover:border-primary/40 hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                            aria-label="Back to articles"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                        {post.category && (
                            <Link
                                href={`/post?category=${post.category.id}`}
                                className="inline-flex h-7 items-center rounded-md border border-border bg-muted/60 px-3 text-xs font-medium text-foreground/80 transition-colors hover:border-primary/40 hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
                            >
                                {post.category.name}
                            </Link>
                        )}
                        <span className="flex items-center gap-1.5 font-medium">
                            <Calendar className="h-4 w-4" />
                            {date}
                        </span>
                        <span aria-hidden="true" className="text-border">
                            ·
                        </span>
                        <span>{minutes} min read</span>
                    </div>

                    <h1 className="text-3xl font-semibold leading-[1.1] tracking-tighter md:text-5xl">
                        <TextReveal text={post.title} />
                    </h1>

                    <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
                        <AuthorCard
                            name={`${post.author.firstName} ${post.author.lastName}`}
                            profilePic={post.author.profilePic}
                        />
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Eye className="h-4 w-4" />
                            {post.views.toLocaleString("en-US")} views
                        </div>
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-10 md:px-6 lg:grid-cols-[1fr_320px] lg:py-14">
                <div className="min-w-0 max-w-3xl">
                    {cover && (
                        <div className="relative mb-8 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border/70 bg-muted">
                            <PostCover
                                src={cover}
                                alt={post.title}
                                label={post.category?.name}
                                priority
                                sizes="(max-width: 1024px) 100vw, 70vw"
                                className="object-cover"
                            />
                        </div>
                    )}

                    <div className="prose prose-base max-w-none dark:prose-invert lg:prose-lg prose-headings:font-semibold prose-headings:tracking-tight prose-p:leading-relaxed prose-strong:text-foreground prose-li:marker:text-muted-foreground">
                        <PostContent content={post.content} />
                    </div>

                    {/* Actions */}
                    <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-8">
                        <div className="flex items-center gap-2">
                            <LikeButton
                                postId={post.id}
                                initialLikeCount={post._count.likes}
                            />
                            <SavePostButton postId={post.id} />
                        </div>
                        <ShareButtons url={`/post/${post.id}`} title={post.title} />
                    </div>

                    <CommentsSection postId={post.id} />

                    <Suspense fallback={<ReadMoreSkeleton />}>
                        <ReadMoreSection
                            currentPostId={post.id}
                            currentCategoryId={post.categoryId}
                        />
                    </Suspense>
                </div>

                {/* Desktop sidebar */}
                <aside className="hidden lg:block">
                    <div className="sticky top-24 space-y-5">
                        <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-card p-6">
                            <BorderBeam
                                duration={9}
                                borderWidth={1.25}
                                colors={["rgba(34,211,238,0.9)", "rgba(129,140,248,0.8)"]}
                            />
                            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                                Written by
                            </h3>
                            <div className="mt-4">
                                <AuthorCard
                                    name={`${post.author.firstName} ${post.author.lastName}`}
                                    profilePic={post.author.profilePic}
                                    position="Blogino Author"
                                />
                            </div>
                        </div>

                        <div className="rounded-2xl border border-border/70 bg-muted/30 p-6">
                            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                At a glance
                            </h3>
                            <dl className="mt-4 divide-y divide-border/70 text-sm">
                                {post.category && (
                                    <div className="flex items-center justify-between gap-4 py-2.5 first:pt-0">
                                        <dt className="text-muted-foreground">Topic</dt>
                                        <dd className="font-medium text-foreground">
                                            {post.category.name}
                                        </dd>
                                    </div>
                                )}
                                <div className="flex items-center justify-between gap-4 py-2.5">
                                    <dt className="text-muted-foreground">Reading time</dt>
                                    <dd className="font-medium text-foreground">
                                        {minutes} min
                                    </dd>
                                </div>
                                <div className="flex items-center justify-between gap-4 py-2.5">
                                    <dt className="text-muted-foreground">Views</dt>
                                    <dd className="font-medium text-foreground">
                                        {post.views.toLocaleString("en-US")}
                                    </dd>
                                </div>
                                <div className="flex items-center justify-between gap-4 py-2.5 last:pb-0">
                                    <dt className="text-muted-foreground">Likes</dt>
                                    <dd className="font-medium text-foreground">
                                        {post._count.likes}
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </aside>
            </div>
        </article>
    );
}
