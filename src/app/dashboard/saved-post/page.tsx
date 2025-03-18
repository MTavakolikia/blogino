"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BookmarkX, BookmarkCheck } from "lucide-react";
import Link from "next/link";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import PostExcerpt from "@/components/posts/PostExcerpt";

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
    category: { name: string };
    author: { firstName: string; lastName: string };
}

export default function SavedPostPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSavedPosts();
    }, []);

    const fetchSavedPosts = async () => {
        try {
            const response = await axios.get("/api/posts/saved");
            setPosts(response.data);
        } catch (error) {
            console.error("Error fetching saved posts:", error);
            toast.error("Failed to fetch saved posts");
        } finally {
            setLoading(false);
        }
    };

    const handleUnsavePost = async (postId: string) => {
        try {
            await axios.delete("/api/posts/saved", {
                data: { postId }
            });
            setPosts(posts.filter(post => post.id !== postId));
            toast.success("Post removed from saved posts");
        } catch (error) {
            console.error("Error removing saved post:", error);
            toast.error("Failed to remove post from saved posts");
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-6 py-8">
                <div className="grid gap-4">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="w-full h-32" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <ProtectedRoute>
            <div className="container mx-auto px-6 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Saved Posts</h1>
                    <p className="text-muted-foreground">
                        {posts.length} {posts.length === 1 ? 'post' : 'posts'} saved
                    </p>
                </div>

                {posts.length === 0 ? (
                    <div className="text-center py-12">
                        <BookmarkCheck className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                        <h2 className="text-xl font-semibold mb-2">No saved posts yet</h2>
                        <p className="text-muted-foreground mb-4">
                            Posts you save will appear here for easy access later.
                        </p>
                        <Link href="/">
                            <Button>Browse Posts</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {posts.map((post) => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                            >
                                <Card className="hover:shadow-lg transition-shadow">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <div>
                                            <h2 className="text-xl font-semibold">
                                                <Link href={`/dashboard/posts/${post.id}`} className="hover:text-primary">
                                                    {post.title}
                                                </Link>
                                            </h2>
                                            <p className="text-sm text-muted-foreground">
                                                By {post.author.firstName} {post.author.lastName} • {post.category?.name}
                                            </p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleUnsavePost(post.id)}
                                            className="text-muted-foreground hover:text-destructive"
                                        >
                                            <BookmarkX className="h-5 w-5" />
                                        </Button>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-muted-foreground mb-4">
                                            <PostExcerpt content={post.content} />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm text-muted-foreground">
                                                Saved on {new Date(post.createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                            <Link href={`/dashboard/posts/${post.id}`}>
                                                <Button variant="outline">Read More</Button>
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </ProtectedRoute>
    );
}