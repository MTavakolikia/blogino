"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Clock, Heart } from "lucide-react";

import PostCover from "@/components/posts/PostCover";
import PostExcerpt from "@/components/posts/PostExcerpt";
import { readingTime } from "@/lib/reading-time";
import { cn } from "@/lib/utils";

export interface PostCardPost {
    id: string;
    title: string;
    content: string;
    images: string[];
    createdAt: string | Date;
    category?: { name: string } | null;
    author?: { firstName: string; lastName: string } | null;
    _count?: { likes: number };
}

function initials(first?: string | null, last?: string | null) {
    const value = `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase();
    return value || "B";
}

export default function PostCard({
    post,
    index = 0,
    variant = "default",
    className,
}: {
    post: PostCardPost;
    index?: number;
    variant?: "default" | "featured";
    className?: string;
}) {
    const featured = variant === "featured";
    const cover = post.images?.[0];
    const author = post.author
        ? `${post.author.firstName} ${post.author.lastName}`
        : null;
    const date = new Date(post.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
    const minutes = readingTime(post.content);
    const likes = post._count?.likes ?? 0;

    return (
        <motion.article
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{
                duration: 0.5,
                delay: (index % 3) * 0.07,
                ease: [0.22, 1, 0.36, 1],
            }}
            className={cn(
                "group/card relative flex h-full flex-col overflow-hidden rounded-3xl border border-border/70 bg-card shadow-sm",
                "transition-[transform,box-shadow,border-color] duration-300 ease-out",
                "hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10",
                featured && "sm:col-span-2",
                className,
            )}
        >
            {/* soft accent glow on hover */}
            <div
                aria-hidden
                className="pointer-events-none absolute -inset-px z-10 rounded-3xl bg-gradient-to-br from-primary/10 via-transparent to-chart-2/10 opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
            />

            <div
                className={cn(
                    "relative flex h-full",
                    featured ? "flex-col md:flex-row" : "flex-col",
                )}
            >
                {/* Cover */}
                <Link
                    href={`/post/${post.id}`}
                    aria-label={post.title}
                    className={cn(
                        "relative block shrink-0 overflow-hidden bg-muted",
                        featured
                            ? "aspect-[16/10] md:aspect-auto md:min-h-[300px] md:w-[55%]"
                            : "aspect-[16/10]",
                    )}
                >
                    <PostCover
                        src={cover}
                        alt={post.title}
                        label={post.category?.name}
                        priority={featured}
                        sizes={
                            featured
                                ? "(max-width: 768px) 100vw, 50vw"
                                : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        }
                        className="object-cover transition-transform duration-700 ease-out group-hover/card:scale-[1.04]"
                    />

                    {/* readability scrim */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-black/0 to-black/0 opacity-70 transition-opacity duration-500 group-hover/card:opacity-100" />

                    <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
                        {post.category ? (
                            <span className="inline-flex max-w-[65%] items-center gap-1.5 rounded-full bg-background/90 px-2.5 py-1 text-[11px] font-semibold text-foreground shadow-sm ring-1 ring-black/5 backdrop-blur-md">
                                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                                <span className="truncate">
                                    {post.category.name}
                                </span>
                            </span>
                        ) : (
                            <span />
                        )}

                        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-black/45 px-2 py-1 text-[11px] font-medium text-white ring-1 ring-white/15 backdrop-blur-md">
                            <Clock className="h-3 w-3" />
                            {minutes} min
                        </span>
                    </div>

                    {featured && (
                        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-primary px-2.5 py-1 text-[11px] font-semibold text-primary-foreground shadow-lg shadow-primary/25">
                            Latest
                        </span>
                    )}
                </Link>

                {/* Body */}
                <div
                    className={cn(
                        "relative flex flex-1 flex-col gap-3 p-5",
                        featured && "md:justify-center md:p-7",
                    )}
                >
                    <h3
                        className={cn(
                            "line-clamp-2 font-semibold leading-snug tracking-tight text-foreground",
                            featured ? "text-xl md:text-2xl" : "text-lg",
                        )}
                    >
                        <Link
                            href={`/post/${post.id}`}
                            className="transition-colors group-hover/card:text-primary"
                        >
                            {post.title}
                        </Link>
                    </h3>

                    <div
                        className={cn(
                            "line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground",
                            featured && "md:text-[15px]",
                        )}
                    >
                        <PostExcerpt content={post.content} />
                    </div>

                    <div className="mt-auto flex items-center justify-between gap-3 border-t border-border/60 pt-3">
                        <div className="flex min-w-0 flex-1 items-center gap-2">
                            <span
                                aria-hidden
                                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary ring-1 ring-primary/15"
                            >
                                {initials(
                                    post.author?.firstName,
                                    post.author?.lastName,
                                )}
                            </span>
                            <div className="min-w-0">
                                <p className="truncate text-xs font-medium text-foreground/80">
                                    {author ?? "Blogino"}
                                </p>
                                <p className="truncate text-[11px] text-muted-foreground">
                                    {date}
                                </p>
                            </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-2">
                            <span className="inline-flex items-center gap-1 rounded-full bg-muted/60 px-2 py-1 text-xs font-medium tabular-nums text-muted-foreground">
                                <Heart className="h-3.5 w-3.5 text-rose-500/80" />
                                {likes}
                            </span>
                            <span
                                aria-hidden
                                className="flex h-7 w-7 items-center justify-center rounded-full border border-border/70 text-muted-foreground transition-colors duration-300 group-hover/card:border-primary group-hover/card:bg-primary group-hover/card:text-primary-foreground"
                            >
                                <ArrowUpRight className="h-3.5 w-3.5" />
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.article>
    );
}
