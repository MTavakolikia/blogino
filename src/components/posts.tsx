"use client"
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
// import PostCard from "./posts/PostCard";

export default function PostList() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get("/api/posts");
                setPosts(response.data);
                console.log(response.data);

            } catch (err: unknown) {

                if (axios.isAxiosError(err)) {
                    toast(err.response?.data?.error || "error occurred.");
                } else {
                    toast("An unexpected error occurred.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) return <p>Loading...</p>;

    return (
        <div className="max-w-md mx-auto p-8 bg-white shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold mb-6 text-center">Latest Posts</h1>
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* {posts && posts.length > 0 ? (
                    posts.map(post => post ? <PostCard key={post.id} postDetail={post} /> : null)
                ) : (
                    <p className="text-center text-gray-500 col-span-full">No posts available.</p>
                )} */}
            </section>
        </div>
    );
}