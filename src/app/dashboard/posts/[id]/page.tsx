"use client";

import { motion } from "framer-motion";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import axios from "axios";

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
}

export default function PostPage({ params }: { params: { id: string } }) {
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await axios.get(`/api/posts/${params.id}`);
                setPost(res.data);
            } catch (error) {
                console.error("Error fetching post:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [params.id]);

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
            <Card className="shadow-lg">
                <CardHeader>
                    <h1 className="text-2xl font-bold">{post.title}</h1>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-700">{post.content}</p>
                    <div className="mt-4 text-sm text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString()}
                    </div>

                    <div className="mt-6 flex justify-between items-center">
                        <Button variant="outline">Back</Button>
                        <Button variant="default">{post.published ? "Unpublish" : "Publish"}</Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
