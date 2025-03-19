"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import PostExcerpt from "@/components/posts/PostExcerpt";
import { Heart, Trash2 } from "lucide-react";
import { toast } from "sonner";

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
}

function LikedPostPage() {
    const [likedPosts, setLikedPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLikedPosts();
    }, []);

    const fetchLikedPosts = async () => {
        try {
            const response = await axios.get("/api/posts/like");
            setLikedPosts(response.data.posts);
        } catch (error) {
            console.error("Error fetching liked posts:", error);
            toast.error("Failed to fetch liked posts");
        } finally {
            setLoading(false);
        }
    };



    const handleUnlike = async (postId: string) => {
        try {
            await axios.post(`/api/posts/like/${postId}`, { postId });
            setLikedPosts(prev => prev.filter(post => post.id !== postId));
            toast.success("Post removed from likes");
        } catch (error) {
            console.error("Error unliking post:", error);
            toast.error("Failed to unlike post");
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">Liked Posts</h1>
                <div className="grid gap-6">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="w-full h-48" />
                    ))}
                </div>
            </div>
        );
    }

    if (likedPosts.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">Liked Posts</h1>
                <div className="text-center py-12">
                    <Heart className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                    <h2 className="text-2xl font-semibold mb-4">No liked posts yet</h2>
                    <p className="text-muted-foreground mb-6">Start exploring and like posts that interest you!</p>
                    <Link href="/post">
                        <Button>Explore Posts</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Liked Posts</h1>
            <div className="grid gap-6">
                {likedPosts.map((post) => (
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
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleUnlike(post.id)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </Button>
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
            </div>
        </div>
    );
}

export default LikedPostPage;