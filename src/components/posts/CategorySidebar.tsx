"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Category {
    id: string;
    name: string;
    _count: {
        posts: number;
    };
}

interface Post {
    id: string;
    title: string;
    createdAt: string;
}

interface CategorySidebarProps {
    categories: Category[];
    recentPosts: Post[];
    selectedCategory: string | null;
}

export default function CategorySidebar({
    categories,
    recentPosts,
    selectedCategory
}: CategorySidebarProps) {
    const router = useRouter();

    const handleCategorySelect = (categoryId: string | null) => {
        router.push(`/post?category=${categoryId || ''}`);
    };

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <h3 className="text-lg font-semibold">Categories</h3>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <Button
                            variant={selectedCategory === null ? "default" : "ghost"}
                            className="w-full justify-start"
                            onClick={() => handleCategorySelect(null)}
                        >
                            All Posts
                        </Button>
                        {categories.map((category) => (
                            <Button
                                key={category.id}
                                variant={selectedCategory === category.id ? "default" : "ghost"}
                                className="w-full justify-start"
                                onClick={() => handleCategorySelect(category.id)}
                            >
                                {category.name}
                                <span className="ml-auto text-sm text-muted-foreground">
                                    ({category._count.posts})
                                </span>
                            </Button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Recent Posts */}
            <Card>
                <CardHeader>
                    <h3 className="text-lg font-semibold">Recent Posts</h3>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {recentPosts.map((post) => (
                            <div key={post.id} className="space-y-1">
                                <Link
                                    href={`/post/${post.id}`}
                                    className="text-sm font-medium hover:text-primary line-clamp-2"
                                >
                                    {post.title}
                                </Link>
                                <p className="text-xs text-muted-foreground">
                                    {new Date(post.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}