"use client";

import { motion } from "framer-motion";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import PostContent from "@/components/posts/PostContent";
import SavePostButton from "@/components/posts/SavePostButton";
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
    category: { name: string };
    author: { firstName: string; lastName: string };
}

export default function PostPage() {
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const params = useParams();
    const router = useRouter();
    const [isSaved, setIsSaved] = useState(false);

    const handleTogglePublishPost = async (isPublished: boolean) => {
        if (isPublished) {
            await axios.put(`/api/posts/${post?.id}`, { published: false });
        } else {
            await axios.put(`/api/posts/${post?.id}`, { published: true });
        }
        toast.success(`Post ${isPublished ? "unpublished" : "published"} successfully!`);
        router.push("/dashboard/posts");
    };

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await axios.get(`/api/posts/${params?.id}`);
                setPost(res.data);

                const savedRes = await axios.get("/api/posts/saved");
                setIsSaved(savedRes.data.some((p: Post) => p.id === params?.id));
            } catch (error) {
                console.error("Error fetching post:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [params?.id]);

    if (loading) {
        return <Skeleton className="w-full h-64" />;
    }

    if (!post) {
        return <div className="text-center text-red-500">Post not found</div>;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto p-6"
        >
            <Card className="shadow-xl rounded-2xl overflow-hidden bg-white">
                {post.images.length > 0 && (
                    <motion.img
                        src={post.images[0]}
                        alt={post.title}
                        className="w-full h-64 object-cover"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                    />
                )}
                <CardHeader className="p-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{post.title}</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            {new Date(post.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}| {post.category?.name}
                        </p>
                    </div>
                    <SavePostButton
                        postId={post.id}
                        isSaved={isSaved}
                        onSaveChange={setIsSaved}
                    />
                </CardHeader>
                <CardContent className="p-6">
                    <div className="prose max-w-none">
                        <PostContent content={post.content} />
                    </div>
                    <p className="mt-4 text-gray-600 font-semibold">
                        Author: {post.author?.firstName} {post.author?.lastName}
                    </p>

                    <motion.div
                        className="mt-6 flex justify-between items-center"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                    >
                        <Button variant="outline" onClick={() => router.back()}>
                            Back
                        </Button>
                        <Button variant="default" onClick={() => handleTogglePublishPost(post.published)}>
                            {post.published ? "Unpublish" : "Publish"}
                        </Button>
                    </motion.div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
