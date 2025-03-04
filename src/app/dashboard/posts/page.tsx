import Link from "next/link";
import { cookies } from "next/headers";
import { prisma } from "@/utils/prisma";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, Eye, EyeOff } from "lucide-react";

async function getUserPosts() {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("user");
    if (!userCookie) {
        throw new Error("User not authenticated");
    }

    let user;
    try {
        user = JSON.parse(userCookie.value);
    } catch (error) {
        throw new Error("Invalid user cookie format");
    }

    const posts = await prisma.post.findMany({
        where: { authorId: user.id },
        orderBy: { createdAt: "desc" },
    });

    return posts;
}

// تغییر وضعیت انتشار پست
async function togglePublishStatus(postId: string, currentStatus: boolean) {
    "use server"; // این خط باعث می‌شود که این تابع در سرور اجرا شود.

    await prisma.post.update({
        where: { id: postId },
        data: { published: !currentStatus },
    });

    // بعد از تغییر وضعیت، صفحه را مجدداً بارگذاری کن تا تغییرات اعمال شوند.
    return { status: "success" };
}

export default async function PostsPage() {
    const posts = await getUserPosts();

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">مدیریت پست‌ها</h1>
                <Link href="/dashboard/posts/create">
                    <Button>پست جدید</Button>
                </Link>
            </div>

            {posts.length === 0 ? (
                <p className="text-gray-500">هنوز هیچ پستی ایجاد نکرده‌اید.</p>
            ) : (
                <div className="grid gap-4">
                    {posts.map((post) => (
                        <div
                            key={post.id}
                            className="flex justify-between items-center p-4 border rounded-lg shadow-sm hover:shadow-md transition"
                        >
                            <div className="flex items-center gap-4 flex-1">
                                {/* آیکون وضعیت انتشار */}
                                {post.published ? (
                                    <Eye className="text-green-500 w-5 h-5" />
                                ) : (
                                    <EyeOff className="text-gray-500 w-5 h-5" />
                                )}

                                {/* لینک به صفحه ویرایش پست */}
                                <Link href={`/dashboard/posts/edit/${post.id}`} className="flex-1">
                                    <h2 className="text-lg font-semibold cursor-pointer">{post.title}</h2>
                                    <p className="text-sm text-gray-500">
                                        {new Date(post.createdAt).toLocaleDateString()}
                                    </p>
                                </Link>
                            </div>

                            <div className="flex gap-2">
                                {/* دکمه تغییر وضعیت انتشار */}
                                <form action={`/dashboard/posts/toggle/${post.id}`} method="POST">
                                    <Button variant="outline" size="icon">
                                        {post.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </Button>
                                </form>

                                {/* دکمه ویرایش */}
                                <Link href={`/dashboard/posts/edit/${post.id}`}>
                                    <Button variant="outline" size="icon">
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                </Link>

                                {/* دکمه حذف */}
                                <form action={`/dashboard/posts/delete/${post.id}`} method="POST">
                                    <Button variant="destructive" size="icon">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </form>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
