import { prisma } from "@/utils/prisma";
import { getDashboardUser } from "@/utils/dashboardAuth";
import ProfilePageClient from "@/components/dashboard/ProfilePageClient";

export const dynamic = "force-dynamic";

export const metadata = { title: "Profile" };

export default async function ProfilePage() {
    const user = await getDashboardUser();

    const [posts, counts] = await Promise.all([
        prisma.post.findMany({
            where: { authorId: user.id, published: true },
            orderBy: { createdAt: "desc" },
            take: 5,
            include: {
                category: { select: { name: true } },
                _count: { select: { likes: true, comments: true } },
            },
        }),
        Promise.all([
            prisma.post.count({ where: { authorId: user.id, published: true } }),
            prisma.like.count({
                where: { post: { authorId: user.id } },
            }),
            prisma.comment.count({ where: { userId: user.id } }),
        ]),
    ]);

    return (
        <ProfilePageClient
            user={{
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                profilePic: user.profilePic,
                joinedAt: user.createdAt.toISOString(),
            }}
            stats={{ published: counts[0], likesReceived: counts[1], comments: counts[2] }}
            recentPosts={posts.map((p) => ({
                id: p.id,
                title: p.title,
                category: p.category?.name ?? null,
                likes: p._count.likes,
                comments: p._count.comments,
                createdAt: p.createdAt.toISOString(),
            }))}
        />
    );
}
