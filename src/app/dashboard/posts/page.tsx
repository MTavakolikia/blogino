import Link from "next/link";
import { cookies } from "next/headers";
import { prisma } from "@/utils/prisma";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, Eye, EyeOff, CheckCircle } from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import axios from "axios";

async function getUserPosts() {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("user");
    if (!userCookie) {
        throw new Error("User not authenticated");
    }

    let user;
    try {
        user = JSON.parse(userCookie.value);

        if (user.role === "ADMIN") {
            return await prisma.post.findMany({
                include: {
                    author: {
                        select: {
                            firstName: true,
                            lastName: true,
                        },
                    },
                },
                orderBy: { createdAt: "desc" },
            });
        }

        // For authors, fetch only their posts
        return await prisma.post.findMany({
            where: { authorId: user.id },
            include: {
                author: {
                    select: {
                        firstName: true,
                        lastName: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });
    } catch (error) {
        console.error("Error fetching user posts:", error);
        throw new Error("Invalid user cookie format");
    }
}

export default async function PostsPage() {
    const posts = await getUserPosts();

    const handleUnpublish = async (postId: string) => {
        await axios.post(`/api/posts/${postId}`, { published: false });
    };

    const handlePublish = async (postId: string) => {
        await axios.post(`/api/posts/${postId}`, { published: true });
    };

    return (
        <ProtectedRoute requiredRoles={["ADMIN", "AUTHOR"]}>
            <div className="container mx-auto px-6 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Posts Management</h1>
                    <Link href="/dashboard/posts/create">
                        <Button>Create New Post</Button>
                    </Link>
                </div>

                <div className="grid gap-4">
                    {posts.map((post) => (
                        <div key={post.id} className="p-4 border rounded-lg bg-card">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-xl font-semibold">{post.title}</h2>
                                    <p className="text-sm text-muted-foreground">
                                        By {post.author.firstName} {post.author.lastName}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="icon">
                                        <Link href={`/dashboard/posts/${post.id}`}>
                                            <Eye className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                    <Button variant="outline" size="icon">
                                        <Link href={`/dashboard/posts/${post.id}/edit`}>
                                            <Edit className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                    {post.published ? (
                                        <Button variant="outline" size="icon" onClick={() => handleUnpublish(post.id)}>
                                            <EyeOff className="h-4 w-4" />
                                        </Button>
                                    ) : (
                                        <Button variant="outline" size="icon" onClick={() => handlePublish(post.id)}>
                                            <CheckCircle className="h-4 w-4" />
                                        </Button>
                                    )}
                                    <Button variant="destructive" size="icon">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                            <div className="mt-2">
                                <p className="text-sm text-muted-foreground">
                                    Status: {post.published ? "Published" : "Draft"}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Created: {new Date(post.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </ProtectedRoute>
    );
}