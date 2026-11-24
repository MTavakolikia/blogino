"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";

import PostCard, { type PostCardPost } from "@/components/posts/PostCard";
import CategoryFilter, {
    type CategoryOption,
} from "@/components/posts/CategoryFilter";

interface PostsExplorerProps {
    initialPosts: PostCardPost[];
    categories: CategoryOption[];
}

export default function PostsExplorer({
    initialPosts,
    categories,
}: PostsExplorerProps) {
    const [selected, setSelected] = useState<string | null>(null);
    const [posts, setPosts] = useState<PostCardPost[]>(initialPosts);
    const [loading, setLoading] = useState(false);
    const firstRender = useRef(true);

    const fetchPosts = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get("/api/posts", {
                params: {
                    limit: 12,
                    ...(selected ? { category: selected } : {}),
                },
            });
            setPosts(res.data.posts);
        } catch {
            /* ignore */
        } finally {
            setLoading(false);
        }
    }, [selected]);

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }
        if (selected) {
            fetchPosts();
        } else {
            setPosts(initialPosts);
        }
    }, [selected, fetchPosts, initialPosts]);

    return (
        <div className="space-y-6">
            <CategoryFilter
                categories={categories}
                selected={selected}
                onSelect={setSelected}
            />

            <div aria-busy={loading} className="relative">
                {loading && (
                    <div className="pointer-events-none absolute inset-0 z-10 -translate-x-1/2 -translate-y-1/2 left-1/2 top-0 text-sm text-muted-foreground">
                        Loading…
                    </div>
                )}
                {posts.length === 0 && !loading ? (
                    <div className="rounded-2xl border border-dashed border-border py-16 text-center text-muted-foreground">
                        No articles in this category yet.
                    </div>
                ) : (
                    <div
                        className={`grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 transition-opacity duration-300 ${
                            loading ? "opacity-40" : "opacity-100"
                        }`}
                    >
                        {posts.map((post, i) => (
                            <PostCard key={post.id} post={post} index={i} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
