"use client";

import * as React from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
    BarChart3,
    Eye,
    EyeOff,
    FileText,
    Loader2,
    Pencil,
    Search,
    Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

export interface DashboardPostRow {
    id: string;
    title: string;
    published: boolean;
    createdAt: string;
    images: string[];
    authorId: string;
    author: { firstName: string; lastName: string };
    category: { name: string } | null;
    likes: number;
    comments: number;
}

type Filter = "all" | "published" | "draft";

export default function DashboardPostList({
    currentUserId,
    currentRole,
    posts: initialPosts,
}: {
    currentUserId: string;
    currentRole: string;
    posts: DashboardPostRow[];
}) {
    const router = useRouter();
    const [posts, setPosts] = React.useState(initialPosts);
    const [filter, setFilter] = React.useState<Filter>("all");
    const [query, setQuery] = React.useState("");
    const [pendingId, setPendingId] = React.useState<string | null>(null);
    const [deleting, setDeleting] = React.useState<DashboardPostRow | null>(null);

    const visible = posts.filter((p) => {
        if (filter === "published" && !p.published) return false;
        if (filter === "draft" && p.published) return false;
        return p.title.toLowerCase().includes(query.trim().toLowerCase());
    });

    const counts = {
        all: posts.length,
        published: posts.filter((p) => p.published).length,
        draft: posts.filter((p) => !p.published).length,
    };

    const canManage = (post: DashboardPostRow) =>
        currentRole === "ADMIN" || post.authorId === currentUserId;

    const togglePublish = async (post: DashboardPostRow) => {
        setPendingId(post.id);
        try {
            await axios.put(`/api/posts/${post.id}`, {
                published: !post.published,
            });
            setPosts(
                posts.map((p) =>
                    p.id === post.id ? { ...p, published: !p.published } : p,
                ),
            );
            toast.success(
                post.published ? "Post unpublished" : "Post published",
            );
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.error || "Failed to update post");
            } else {
                toast.error("Failed to update post");
            }
        } finally {
            setPendingId(null);
        }
    };

    const handleDelete = async (post: DashboardPostRow) => {
        setDeleting(null);
        try {
            await axios.delete(`/api/posts/${post.id}`);
            setPosts(posts.filter((p) => p.id !== post.id));
            toast.success("Post deleted");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.error || "Failed to delete post");
            } else {
                toast.error("Failed to delete post");
            }
        }
    };

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex rounded-lg border border-border/70 bg-card p-0.5">
                    {(["all", "published", "draft"] as const).map((f) => (
                        <button
                            key={f}
                            type="button"
                            onClick={() => setFilter(f)}
                            className={cn(
                                "rounded-md px-3 py-1.5 text-sm font-medium capitalize transition-colors",
                                filter === f
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:text-foreground",
                            )}
                        >
                            {f === "draft" ? "Drafts" : f}
                            <span className="ml-1.5 text-xs tabular-nums opacity-70">
                                {counts[f]}
                            </span>
                        </button>
                    ))}
                </div>
                <div className="relative w-full max-w-xs">
                    <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Filter by title..."
                        className="pl-8"
                    />
                </div>
            </div>

            {/* List */}
            {visible.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border bg-card/50 py-16 text-center">
                    <FileText className="mx-auto h-10 w-10 text-muted-foreground/50" />
                    <p className="mt-3 font-medium">
                        {query ? "No posts match your filter." : "Nothing here yet."}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {filter === "draft" && !query
                            ? "Drafts you write will appear here."
                            : "Try a different filter, or write your first post."}
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {visible.map((post) => (
                        <div
                            key={post.id}
                            className="group flex flex-wrap items-center gap-4 rounded-xl border border-border/70 bg-card p-4 shadow-sm transition-colors hover:border-primary/30"
                        >
                            {/* Cover placeholder */}
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

                            <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span
                                        className={cn(
                                            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
                                            post.published
                                                ? "bg-primary/10 text-primary"
                                                : "bg-chart-4/10 text-chart-4",
                                        )}
                                    >
                                        {post.published ? (
                                            <Eye className="h-3 w-3" />
                                        ) : (
                                            <EyeOff className="h-3 w-3" />
                                        )}
                                        {post.published ? "Published" : "Draft"}
                                    </span>
                                    {post.category && (
                                        <span className="rounded-full border border-border bg-muted/40 px-2 py-0.5 text-[11px] text-muted-foreground">
                                            {post.category.name}
                                        </span>
                                    )}
                                    {currentRole === "ADMIN" && (
                                        <span className="text-[11px] text-muted-foreground">
                                            by {post.author.firstName} {post.author.lastName}
                                        </span>
                                    )}
                                </div>
                                <h3 className="mt-1.5 truncate font-semibold tracking-tight">
                                    {post.title}
                                </h3>
                                <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                                    <span>
                                        {new Date(post.createdAt).toLocaleDateString(
                                            "en-US",
                                            { month: "short", day: "numeric", year: "numeric" },
                                        )}
                                    </span>
                                    <span className="inline-flex items-center gap-1">
                                        <BarChart3 className="h-3 w-3" />
                                        {post.likes} likes
                                    </span>
                                    <span>{post.comments} comments</span>
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1">
                                <Button asChild variant="ghost" size="icon" className="h-8 w-8" aria-label="View post">
                                    <Link href={`/post/${post.id}`}>
                                        <Eye className="h-3.5 w-3.5" />
                                    </Link>
                                </Button>
                                <Button asChild variant="ghost" size="icon" className="h-8 w-8" aria-label="Edit post">
                                    <Link href={`/dashboard/posts/${post.id}`}>
                                        <Pencil className="h-3.5 w-3.5" />
                                    </Link>
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    disabled={pendingId === post.id || !canManage(post)}
                                    onClick={() => togglePublish(post)}
                                    aria-label={post.published ? "Unpublish post" : "Publish post"}
                                >
                                    {pendingId === post.id ? (
                                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    ) : post.published ? (
                                        <EyeOff className="h-3.5 w-3.5" />
                                    ) : (
                                        <Eye className="h-3.5 w-3.5" />
                                    )}
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                    onClick={() => setDeleting(post)}
                                    aria-label="Delete post"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <AlertDialog
                open={!!deleting}
                onOpenChange={(open) => !open && setDeleting(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete this post?</AlertDialogTitle>
                        <AlertDialogDescription>
                            &ldquo;{deleting?.title}&rdquo; will be permanently
                            removed, including its likes and comments. This can&apos;t
                            be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={() => deleting && handleDelete(deleting)}
                        >
                            Delete post
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
