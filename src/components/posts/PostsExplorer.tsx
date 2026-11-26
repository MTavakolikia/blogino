"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";

import PostCard, { type PostCardPost } from "@/components/posts/PostCard";
import CategoryFilter, {
    type CategoryOption,
} from "@/components/posts/CategoryFilter";
import PostsGridSkeleton from "@/components/skeletons/PostsGridSkeleton";

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

            <div aria-busy={loading} aria-live="polite">
                {loading ? (
                    <PostsGridSkeleton count={6} featured />
                ) : posts.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-border py-16 text-center text-muted-foreground">
                        No articles in this category yet.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {posts.map((post, i) => (
                            <PostCard
                                key={post.id}
                                post={post}
                                index={i}
                                variant={i === 0 ? "featured" : "default"}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
