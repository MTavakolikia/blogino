"use client"

import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PostCard from "./PostCard";
import axios from "axios";
import { toast } from "sonner";

const categories = ["All", "Technology", "Business", "Sports", "Entertainment"];



export default function NewsByCategory() {
    const [activeCategory, setActiveCategory] = useState("All");
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(false)

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


    const filteredPosts =
        activeCategory === "All"
            ? posts
            : posts.filter((post) => post.category === activeCategory);

    if (loading) return "Loading...."
    return (
        <div className="container mx-auto px-6 py-8">
            <h2 className="text-2xl font-bold text-center mb-6">Latest News</h2>

            <Tabs defaultValue="All" className="mb-6">
                <TabsList className="flex justify-center space-x-4">
                    {categories.map((category) => (
                        <TabsTrigger
                            key={category}
                            value={category}
                            onClick={() => setActiveCategory(category)}
                        >
                            {category}
                        </TabsTrigger>
                    ))}
                </TabsList>

                <TabsContent value={activeCategory}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPosts.map((post) => (
                            <PostCard key={post.id} postDetail={post} />
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
