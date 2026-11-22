"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { toast } from "sonner";
import { MessageSquare, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import useUserStore from "@/store/userStore";
import { cn } from "@/lib/utils";

interface CommentUser {
    firstName: string;
    lastName: string;
    profilePic: string | null;
}

interface Comment {
    id: string;
    content: string;
    approved: boolean;
    createdAt: string;
    user: CommentUser | null;
    replies: Comment[];
}

function initials(name?: string) {
    if (!name) return "?";
    return name
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
}

function timeAgo(dateStr: string) {
    const then = new Date(dateStr).getTime();
    const diff = Date.now() - then;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days <= 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 30) return `${days} days ago`;
    const months = Math.floor(days / 30);
    if (months === 1) return "1 month ago";
    if (months < 12) return `${months} months ago`;
    const years = Math.floor(months / 12);
    return years === 1 ? "1 year ago" : `${years} years ago`;
}

function CommentItem({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) {
    const name = comment.user
        ? `${comment.user.firstName} ${comment.user.lastName}`
        : "Guest";
    return (
        <div className={cn("flex gap-3", isReply && "ml-8 md:ml-12")}>
            <Avatar className="h-9 w-9 shrink-0 border border-border/60">
                {comment.user?.profilePic ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={comment.user.profilePic} alt={name} className="h-full w-full object-cover" />
                ) : (
                    <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                        {initials(name)}
                    </AvatarFallback>
                )}
            </Avatar>
            <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-x-2">
                    <span className="text-sm font-semibold text-foreground">{name}</span>
                    <span className="text-xs text-muted-foreground">{timeAgo(comment.createdAt)}</span>
                </div>
                <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-foreground/85">
                    {comment.content}
                </p>
            </div>
        </div>
    );
}

export default function CommentsSection({ postId }: { postId: string }) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const user = useUserStore((s) => s.user);

    const fetchComments = useCallback(async () => {
        try {
            const res = await axios.get("/api/posts/comments", {
                params: { postId },
            });
            const all: Comment[] = res.data;
            setComments(
                all.filter((c) => c.approved).map((c) => ({
                    ...c,
                    replies: (c.replies || []).filter((r: Comment) => r.approved),
                })),
            );
        } catch {
            /* ignore */
        } finally {
            setLoading(false);
        }
    }, [postId]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const total = comments.reduce((n, c) => n + 1 + c.replies.length, 0);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() || !user) return;
        setSubmitting(true);
        try {
            await axios.post("/api/posts/comments", {
                content: content.trim(),
                postId,
                userId: user.id,
            });
            setContent("");
            toast.success("Comment posted");
            await fetchComments();
        } catch {
            toast.error("Failed to post comment");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section id="comments" className="mt-12 border-t border-border pt-10">
            <h2 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
                <MessageSquare className="h-5 w-5 text-primary" />
                Comments
                <span className="text-base font-normal text-muted-foreground">
                    ({total})
                </span>
            </h2>

            {/* Add comment */}
            {user ? (
                <form onSubmit={submit} className="mt-6">
                    <div className="flex gap-3">
                        <Avatar className="h-9 w-9 shrink-0 border border-border/60">
                            <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                                {initials(`${user.firstName} ${user.lastName}`)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <Textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Share your thoughts…"
                                rows={3}
                                className="resize-none"
                            />
                            <div className="mt-2 flex justify-end">
                                <Button
                                    type="submit"
                                    size="sm"
                                    disabled={submitting || !content.trim()}
                                >
                                    <Send className="mr-1.5 h-3.5 w-3.5" />
                                    {submitting ? "Posting…" : "Post comment"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            ) : (
                <div className="mt-6 flex flex-col items-start gap-2 rounded-xl border border-dashed border-border bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-muted-foreground">
                        Join the conversation — log in to add a comment.
                    </p>
                    <Button asChild size="sm">
                        <Link href="/login">Log in</Link>
                    </Button>
                </div>
            )}

            {/* List */}
            <div className="mt-8">
                {loading ? (
                    <div className="space-y-6">
                        {[0, 1, 2].map((i) => (
                            <div key={i} className="flex animate-pulse gap-3">
                                <div className="h-9 w-9 shrink-0 rounded-full bg-muted" />
                                <div className="flex-1 space-y-2 py-1">
                                    <div className="h-3 w-32 rounded bg-muted" />
                                    <div className="h-3 w-3/4 rounded bg-muted" />
                                    <div className="h-3 w-1/2 rounded bg-muted" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : comments.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                        No comments yet. Be the first to share your thoughts.
                    </p>
                ) : (
                    <AnimatePresence initial={false}>
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="space-y-8"
                        >
                            {comments.map((c) => (
                                <div key={c.id}>
                                    <CommentItem comment={c} />
                                    <div className="mt-4 space-y-4">
                                        {c.replies.map((r) => (
                                            <CommentItem key={r.id} comment={r} isReply />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                )}
            </div>
        </section>
    );
}
