"use client";

import * as React from "react";
import Link from "next/link";
import {
    ArrowUpRight,
    Bookmark,
    BookmarkX,
    CalendarDays,
    FileText,
    Heart,
    Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card";

export interface ActivityPost {
    id: string;
    title: string;
    content: string;
    images: string[];
    category: { name: string } | null;
    author: { firstName: string; lastName: string };
    createdAt: string;
    savedAt?: string;
    likedAt?: string;
}

export function ActivityPostCard({
    post,
    mode,
    onRemove,
    removing,
}: {
    post: ActivityPost;
    mode: "saved" | "liked";
    onRemove: (id: string) => void;
    removing: boolean;
}) {
    const label = post.savedAt ?? post.likedAt ?? post.createdAt;
    const Icon = mode === "saved" ? Bookmark : Heart;

    return (
        <Card className="overflow-hidden shadow-sm transition-shadow hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between gap-4 p-4 pb-0">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-14 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border/60 bg-muted/40">
                        {post.images?.[0] ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={post.images[0]}
                                alt=""
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <FileText className="h-5 w-5 text-muted-foreground/50" />
                        )}
                    </div>
                    <div className="min-w-0">
                        <h3 className="truncate font-semibold tracking-tight">
                            <Link href={`/post/${post.id}`} className="hover:text-primary">
                                {post.title}
                            </Link>
                        </h3>
                        <p className="mt-0.5 truncate text-sm text-muted-foreground">
                            By {post.author.firstName} {post.author.lastName}
                            {post.category && ` · ${post.category.name}`}
                        </p>
                    </div>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-muted/40 px-2.5 py-1 text-xs text-muted-foreground">
                        <Icon className="h-3 w-3" />
                        {new Date(label).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                        })}
                    </span>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => onRemove(post.id)}
                        disabled={removing}
                        aria-label={mode === "saved" ? "Remove from saved" : "Unlike"}
                    >
                        {removing ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : mode === "saved" ? (
                            <BookmarkX className="h-4 w-4" />
                        ) : (
                            <Heart className="h-4 w-4" />
                        )}
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-4">
                <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                    {post.content.replace(/<[^>]*>/g, " ").trim()}
                </p>
                <div className="mt-3 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {mode === "saved" ? "Saved" : "Liked"} on{" "}
                        {new Date(label).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                        })}
                    </span>
                    <Link
                        href={`/post/${post.id}`}
                        className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline underline-offset-4"
                    >
                        Read <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}
