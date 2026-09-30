"use client";

import * as React from "react";
import Link from "next/link";
import axios from "axios";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Bookmark, Compass } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ActivityPostCard, type ActivityPost } from "@/components/dashboard/activity/ActivityPostCard";

const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.05 } },
};
const item = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export default function SavedPostPage() {
    const [posts, setPosts] = React.useState<ActivityPost[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [removing, setRemoving] = React.useState<string | null>(null);

    const fetchSaved = async () => {
        try {
            const res = await axios.get("/api/posts/saved");
            setPosts(res.data);
        } catch {
            toast.error("Failed to load saved posts");
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchSaved();
    }, []);

    const handleRemove = async (postId: string) => {
        setRemoving(postId);
        try {
            await axios.delete("/api/posts/saved", { data: { postId } });
            setPosts((prev) => prev.filter((p) => p.id !== postId));
            toast.success("Removed from saved posts");
        } catch {
            toast.error("Couldn't remove the post");
        } finally {
            setRemoving(null);
        }
    };

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="h-8 w-48 animate-pulse rounded-lg bg-muted" />
                {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-32 w-full rounded-2xl" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                    Library
                </p>
                <h1 className="mt-1 text-2xl font-semibold tracking-tight">Saved posts</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    {posts.length === 0
                        ? "Bookmark articles to read later."
                        : `${posts.length} article${posts.length === 1 ? "" : "s"} saved for later.`}
                </p>
            </div>

            {posts.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border bg-card/50 py-16 text-center">
                    <Bookmark className="mx-auto h-10 w-10 text-muted-foreground/40" />
                    <h2 className="mt-4 font-semibold">Nothing saved yet</h2>
                    <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
                        Tap the bookmark icon on any article and it will show up here.
                    </p>
                    <Button asChild className="mt-6">
                        <Link href="/post">
                            <Compass className="h-4 w-4" /> Browse articles
                        </Link>
                    </Button>
                </div>
            ) : (
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid gap-4 lg:grid-cols-2"
                >
                    {posts.map((post) => (
                        <motion.div key={post.id} variants={item}>
                            <ActivityPostCard
                                post={post}
                                mode="saved"
                                onRemove={handleRemove}
                                removing={removing === post.id}
                            />
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    );
}
