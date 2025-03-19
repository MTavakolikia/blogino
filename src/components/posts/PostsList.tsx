"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import PostExcerpt from "@/components/posts/PostExcerpt";
import PostPagination from "./PostPagination";
import LikeButton from "./LikeButton";

interface Post {
    id: string;
    title: string;
    content: string;
    published: boolean;
    images: string[];
    authorId: string;
    categoryId: string | null;
    createdAt: string;
    updatedAt: string;
    category: { name: string } | null;
    author: { firstName: string; lastName: string };
    _count?: {
        likes: number;
    };
}

interface PostsListProps {
    initialPosts: Post[];
    totalPages: number;
    currentPage: number;
    selectedCategory: string | null;
}

const POSTS_PER_PAGE = 6;

export default function PostsList({ initialPosts, totalPages, currentPage, selectedCategory }: PostsListProps) {
    const [posts, setPosts] = useState(initialPosts);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(currentPage);

    // Reset page when category changes
    useEffect(() => {
        setPage(1);
    }, [selectedCategory]);

    // Fetch posts when page or category changes
    useEffect(() => {
        fetchPosts();
    }, [page, selectedCategory]);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const response = await axios.get("/api/posts", {
                params: {
                    page,
                    limit: POSTS_PER_PAGE,
                    category: selectedCategory
                }
            });
            setPosts(response.data.posts);
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="grid gap-6">
            {loading ? (
                Array.from({ length: POSTS_PER_PAGE }).map((_, i) => (
                    <Skeleton key={i} className="w-full h-48" />
                ))
            ) : posts.length === 0 ? (
                <div className="text-center py-12">
                    <h2 className="text-2xl font-semibold mb-4">No posts found</h2>
                    <p className="text-muted-foreground">Try selecting a different category or check back later.</p>
                </div>
            ) : (
                <>
                    {posts.map((post) => (
                        <Card key={post.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-xl font-semibold">
                                            <Link href={`/post/${post.id}`} className="hover:text-primary">
                                                {post.title}
                                            </Link>
                                        </h2>
                                        <p className="text-sm text-muted-foreground">
                                            By {post.author.firstName} {post.author.lastName} • {post.category?.name}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <LikeButton
                                            postId={post.id}
                                            initialLikeCount={post._count?.likes || 0}
                                        />
                                        <span className="text-sm text-muted-foreground">
                                            {new Date(post.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <PostExcerpt content={post.content} />
                                <div className="mt-4">
                                    <Link href={`/post/${post.id}`}>
                                        <Button variant="outline">Read More</Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {totalPages > 1 && (
                        <PostPagination
                            currentPage={page}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    )}
                </>
            )}
        </div>
    );
}