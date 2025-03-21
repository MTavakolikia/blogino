import Link from "next/link";
import { cookies } from "next/headers";
import { prisma } from "@/utils/prisma";
import { Button } from "@/components/ui/button";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardPostCard from "@/components/dashboard/posts/DashboardPostCard";

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
                        <DashboardPostCard key={post.id} post={post} />

                    ))}
                </div>
            </div>
        </ProtectedRoute>
    );
}