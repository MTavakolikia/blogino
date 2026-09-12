import { prisma } from "@/utils/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, Eye } from "lucide-react";

import PostContent from "@/components/posts/PostContent";
import LikeButton from "@/components/posts/LikeButton";
import SavePostButton from "@/components/posts/SavePostButton";
import ShareButtons from "@/components/posts/ShareButtons";
import CommentsSection from "@/components/posts/CommentsSection";
import { AuthorCard } from "@/components/posts/AuthorCard";
import { ReadMoreSection } from "@/components/posts/ReadMoreSection";
import { BorderBeam } from "@/components/magicui/border-beam";
import { FlickeringGrid } from "@/components/magicui/flickering-grid";
import { TextReveal } from "@/components/magicui/text-reveal";

export const dynamic = "force-dynamic";

function readingTime(content: string) {
    const words = content.replace(/<[^>]*>/g, " ").trim().split(/\s+/).length;
    return Math.max(1, Math.round(words / 200));
}

export default async function SinglePostPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const post = await prisma.post.findFirst({
        where: { id, published: true },
        include: {
            author: { select: { firstName: true, lastName: true, profilePic: true } },
            category: { select: { id: true, name: true } },
            _count: { select: { likes: true } },
        },
    });

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
                        color="var(--ring)"
                        maxOpacity={0.14}
                        flickerChance={0.05}
                    />
                </div>

                <div className="relative mx-auto max-w-3xl px-4 py-8 md:px-6 md:py-12">
                    <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-3">
                        <Link
                            href="/post"
                            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/70 bg-background/60 text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
                            aria-label="Back to articles"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                        {post.category && (
                            <Link
                                href={`/post?category=${post.category.id}`}
                                className="inline-flex h-6 items-center rounded-md border border-border bg-muted/50 px-2.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                            >
                                {post.category.name}
                            </Link>
                        )}
                        <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5" />
                            {date}
                        </span>
                        <span className="text-xs text-muted-foreground">
                            · {minutes} min read
                        </span>
                    </div>

                    <h1 className="text-3xl font-semibold leading-[1.1] tracking-tighter md:text-5xl">
                        <TextReveal text={post.title} />
                    </h1>

                    <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                        <AuthorCard
                            name={`${post.author.firstName} ${post.author.lastName}`}
                            profilePic={post.author.profilePic}
                        />
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Eye className="h-3.5 w-3.5" />
                            {post.views.toLocaleString()} views
                        </div>
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-10 md:px-6 lg:grid-cols-[1fr_320px] lg:py-14">
                <div className="min-w-0 max-w-3xl">
                    {cover && (
                        <div className="relative mb-8 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border/70">
                            <Image
                                src={cover}
                                alt={post.title}
                                fill
                                priority
                                sizes="(max-width: 1024px) 100vw, 70vw"
                                className="object-cover"
                            />
                        </div>
                    )}

                    <div className="prose prose-base dark:prose-invert lg:prose-lg max-w-none">
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

                    <ReadMoreSection
                        currentPostId={post.id}
                        currentCategoryId={post.categoryId}
                    />
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
                            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                                In this article
                            </h3>
                            <ul className="mt-4 space-y-2.5 text-sm">
                                {(post.category ? [post.category.name] : []).map(
                                    (c) => (
                                        <li key={c} className="text-foreground/80">
                                            {c}
                                        </li>
                                    ),
                                )}
                                <li className="text-foreground/80">
                                    {minutes} minute read
                                </li>
                                <li className="text-foreground/80">
                                    {post.views.toLocaleString()} views
                                </li>
                                <li className="text-foreground/80">
                                    {post._count.likes} likes
                                </li>
                            </ul>
                        </div>
                    </div>
                </aside>
            </div>
        </article>
    );
}
