import { prisma } from "@/utils/prisma";
import { getDashboardUser } from "@/utils/dashboardAuth";
import { SectionHeading } from "@/components/root/SectionHeading";
import DashboardPostList from "@/components/dashboard/posts/DashboardPostList";

export const dynamic = "force-dynamic";

export const metadata = { title: "My Posts" };

async function getUserPosts(userId: string, role: string) {
    return prisma.post.findMany({
        where: role === "ADMIN" ? {} : { authorId: userId },
        orderBy: { createdAt: "desc" },
        include: {
            author: { select: { firstName: true, lastName: true } },
            category: { select: { name: true } },
            _count: { select: { likes: true, comments: true } },
        },
    });
}

export default async function PostsPage() {
    const user = await getDashboardUser(["ADMIN", "AUTHOR"]);
    const posts = await getUserPosts(user.id, user.role);

    const published = posts.filter((p) => p.published).length;

    return (
        <div className="space-y-6">
            <SectionHeading
                eyebrow="Writing"
                title="Posts"
                description={
                    user.role === "ADMIN"
                        ? "All posts on the blog. You can manage any of them."
                        : `Everything you've written — ${published} published, ${posts.length - published} in drafts.`
                }
            />

            <DashboardPostList
                currentUserId={user.id}
                currentRole={user.role}
                posts={posts.map((p) => ({
                    id: p.id,
                    title: p.title,
                    published: p.published,
                    createdAt: p.createdAt.toISOString(),
                    images: p.images,
                    authorId: p.authorId,
                    author: p.author,
                    category: p.category,
                    likes: p._count.likes,
                    comments: p._count.comments,
                }))}
            />
        </div>
    );
}
