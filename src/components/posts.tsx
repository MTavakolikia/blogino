"use client"
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

interface Post {
    id: number;
    title: string;
    content: string;
    createdAt: string;
}

export default function Posts() {
    const [posts, setPosts] = useState<Post[]>([]);

    const fetchPosts = async () => {
        try {
            const response = await fetch("/api/posts");
            const data = await response.json();

            setPosts(data);
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);


    return (
        <div className="mt-8 space-y-4">
            {posts.map((post) => (
                <div key={post.id} className="p-4 border border-gray-200 rounded-lg">
                    <h2 className="text-xl font-semibold">{post.title}</h2>
                    <p className="mt-2 text-gray-700">{post.content}</p>
                    <p className="mt-2 text-sm text-gray-500">
                        تاریخ ایجاد: {new Date(post.createdAt).toLocaleString()}
                    </p>
                    <Button>Click me</Button>

                </div>
            ))}
        </div>
    )
}
