"use client"
import axios from "axios";
import { useEffect, useState } from "react";

export default function PostList() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get("/api/posts");
                setPosts(response.data);
            } catch (err: any) {
                setError(err.response?.data?.error || "خطایی رخ داد.");
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) return <p>در حال بارگذاری...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="max-w-md mx-auto p-8 bg-white shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold mb-6 text-center">آخرین پست‌ها</h1>
            <ul className="space-y-4">
                {posts.map((post) => (
                    <li key={post.id} className="bg-gray-100 p-4 rounded-md shadow-sm">
                        <h2 className="text-xl font-semibold">{post.title}</h2>
                        <p className="text-sm text-gray-500">نویسنده: {post.author.firstName} {post.author.lastName}</p>
                        <p className="text-gray-700">{post.content.substring(0, 100)}...</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}