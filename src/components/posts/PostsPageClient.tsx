"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";

import PostCard, { type PostCardPost } from "@/components/posts/PostCard";
import CategoryFilter, {
    type CategoryOption,
} from "@/components/posts/CategoryFilter";
import PostPagination from "@/components/posts/PostPagination";

interface PostsPageClientProps {
    initialPosts: PostCardPost[];
    categories: CategoryOption[];
    totalPages: number;
    currentPage: number;
    selectedCategory: string | null;
    perPage: number;
}

export default function PostsPageClient({
    initialPosts,
    categories,
    totalPages,
    currentPage,
    selectedCategory,
    perPage,
}: PostsPageClientProps) {
    const [selected, setSelected] = useState<string | null>(selectedCategory);
    const [posts, setPosts] = useState<PostCardPost[]>(initialPosts);
    const [page, setPage] = useState(currentPage);
    const [pages, setPages] = useState(totalPages);
    const [loading, setLoading] = useState(false);
    const firstRender = useRef(true);

    const fetchPosts = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get("/api/posts", {
                params: {
                    page,
                    limit: perPage,
                    ...(selected ? { category: selected } : {}),
                },
            });
            setPosts(res.data.posts);
            setPages(res.data.totalPages);
        } catch {
            /* ignore */
        } finally {
            setLoading(false);
        }
    }, [page, selected, perPage]);

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }
        fetchPosts();
    }, [fetchPosts]);

    const changeCategory = (id: string | null) => {
        setSelected(id);
        setPage(1);
    };

    const changePage = (p: number) => {
        setPage(p);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="space-y-6">
            <CategoryFilter
                categories={categories}
                selected={selected}
                onSelect={changeCategory}
            />

            <div aria-busy={loading} className="relative">
                <div
                    className={`grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 transition-opacity duration-300 ${
                        loading ? "opacity-40" : "opacity-100"
                    }`}
                >
                    {posts.length === 0 && !loading ? (
                        <div className="col-span-full rounded-2xl border border-dashed border-border py-16 text-center text-muted-foreground">
                            No articles found.
                        </div>
                    ) : (
                        posts.map((post, i) => (
                            <PostCard key={post.id} post={post} index={i} />
                        ))
                    )}
                </div>
            </div>

            {pages > 1 && (
                <PostPagination
                    currentPage={page}
                    totalPages={pages}
                    onPageChange={changePage}
                />
            )}
        </div>
    );
}
