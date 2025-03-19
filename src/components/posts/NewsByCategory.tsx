"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PostCard from "./PostCard";
import axios from "axios";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface Category {
    id: string;
    name: string;
}

interface Post {
    id: string;
    title: string;
    content: string;
    images: string[];
    category: { name: string };
    createdAt: string;
    published: boolean;
    authorId?: string;
    updatedAt?: string;
}

export default function NewsByCategory() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [activeCategory, setActiveCategory] = useState("All");
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get("/api/posts/category");
                setCategories(response.data);
            } catch (err) {
                console.log(err);
                toast("Failed to fetch categories.");
            }
        };

        const fetchPosts = async () => {
            try {
                const response = await axios.get("/api/posts");
                setPosts(response.data.posts);
            } catch (err) {
                console.log(err);
                toast("Failed to fetch posts.");
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
        fetchPosts();
    }, []);

    const filteredPosts =
        activeCategory === "All"
            ? posts
            : posts.filter((post) => post.category?.name === activeCategory);

    if (loading) return <div className="text-center py-10 text-lg">Loading...</div>;

    return (
        <div className="container mx-auto px-6 py-8">

            <Tabs defaultValue="All" className="mb-6">
                <TabsList className="flex justify-center space-x-4 bg-gray-200 dark:bg-gray-800 p-2 rounded-lg">
                    <TabsTrigger
                        value="All"
                        onClick={() => setActiveCategory("All")}
                        className="dark:text-white"
                    >
                        All
                    </TabsTrigger>
                    {categories.map((category) => (
                        <TabsTrigger
                            key={category?.id}
                            value={category?.name}
                            onClick={() => setActiveCategory(category?.name)}
                            className="dark:text-white"
                        >
                            {category?.name}
                        </TabsTrigger>
                    ))}
                </TabsList>

                <TabsContent value={activeCategory}>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {filteredPosts.length > 0 ? (
                            filteredPosts.map((post) => (
                                <PostCard key={post.id} postDetail={post} />
                            ))
                        ) : (
                            <p className="text-center col-span-3 text-gray-500 dark:text-gray-400">
                                No posts available in this category.
                            </p>
                        )}
                    </motion.div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
