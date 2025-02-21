"use client"

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PostCard from "./posts/PostCard";

const categories = ["All", "Technology", "Business", "Sports", "Entertainment"];

const posts = [
    { id: 1, title: "Tech News", category: "Technology" },
    { id: 2, title: "Business Trends", category: "Business" },
    { id: 3, title: "Football Updates", category: "Sports" },
    { id: 4, title: "New Movies", category: "Entertainment" },
];

export default function NewsByCategory() {
    const [activeCategory, setActiveCategory] = useState("All");

    const filteredPosts =
        activeCategory === "All"
            ? posts
            : posts.filter((post) => post.category === activeCategory);


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
                            <PostCard key={post.id} />
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
