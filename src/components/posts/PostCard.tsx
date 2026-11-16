"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, Heart } from "lucide-react";

import PostExcerpt from "@/components/posts/PostExcerpt";
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

export default function PostCard({
    post,
    index = 0,
    className,
}: {
    post: PostCardPost;
    index?: number;
    className?: string;
}) {
    const cover = post.images?.[0];
    const author = post.author
        ? `${post.author.firstName} ${post.author.lastName}`
        : null;
    const date = new Date(post.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });

    return (
        <motion.article
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: (index % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
                "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-card transition-colors hover:border-primary/40",
                className,
            )}
        >
            {/* Cover */}
            <Link
                href={`/post/${post.id}`}
                className="relative block aspect-[16/10] w-full overflow-hidden bg-muted"
            >
                {cover ? (
                    <Image
                        src={cover}
                        alt={post.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-4xl text-muted-foreground/40">
                        ✦
                    </div>
                )}
                {post.category && (
                    <span className="absolute left-3 top-3 rounded-full bg-background/85 px-2.5 py-1 text-xs font-medium text-foreground backdrop-blur-sm">
                        {post.category.name}
                    </span>
                )}
            </Link>

            {/* Body */}
            <div className="flex flex-1 flex-col gap-3 p-5">
                <h3 className="line-clamp-2 text-lg font-semibold leading-snug tracking-tight text-foreground">
                    <Link
                        href={`/post/${post.id}`}
                        className="transition-colors group-hover:text-primary"
                    >
                        {post.title}
                    </Link>
                </h3>

                <div className="line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    <PostExcerpt content={post.content} />
                </div>

                <div className="flex items-center justify-between border-t border-border/60 pt-3 text-xs text-muted-foreground">
                    <div className="flex min-w-0 items-center gap-2">
                        {author && (
                            <span className="truncate font-medium text-foreground/80">
                                {author}
                            </span>
                        )}
                        {author && <span className="shrink-0">•</span>}
                        <span className="flex shrink-0 items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {date}
                        </span>
                    </div>
                    <span className="flex shrink-0 items-center gap-1">
                        <Heart className="h-3.5 w-3.5" />
                        {post._count?.likes ?? 0}
                    </span>
                </div>
            </div>
        </motion.article>
    );
}
