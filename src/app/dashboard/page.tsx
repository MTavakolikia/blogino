import DashboardStats from "@/components/dashboard/DashboardStats";
import EngagementChart from "@/components/dashboard/EngagementChart";
import { getDashboardUser } from "@/utils/dashboardAuth";
import { prisma } from "@/utils/prisma";

export const dynamic = "force-dynamic";

async function getStats(userId: string) {
    const [activePosts, inactivePosts, categories, likes, comments, likesRows, commentsRows] =
        await Promise.all([
            prisma.post.count({ where: { published: true, authorId: userId } }),
            prisma.post.count({ where: { published: false, authorId: userId } }),
            prisma.category.count(),
            // Likes *on this user's posts* (received, not given).
            prisma.like.count({ where: { post: { authorId: userId } } }),
            prisma.comment.count({ where: { userId } }),
            prisma.like.findMany({
                where: { post: { authorId: userId } },
                select: { createdAt: true },
            }),
            prisma.comment.findMany({
                where: { userId },
                select: { createdAt: true },
            }),
        ]);

    const countByMonth = (rows: { createdAt: Date }[]) => {
        const counts = new Map<number, number>();
        for (const row of rows) {
            const month = new Date(row.createdAt).getMonth();
            counts.set(month, (counts.get(month) || 0) + 1);
        }
        return counts;
    };

    const likesByMonth = countByMonth(likesRows);
    const commentsByMonth = countByMonth(commentsRows);

    const engagementData = Array.from({ length: 12 }, (_, i) => {
        const month = new Date(0, i).toLocaleString("en-US", { month: "long" });
        return {
            month,
            likes: likesByMonth.get(i) || 0,
            comments: commentsByMonth.get(i) || 0,
        };
    });

    return { activePosts, inactivePosts, categories, likes, comments, engagementData };
}

export default async function DashboardPage() {
    const user = await getDashboardUser();
    const stats = await getStats(user.id);

    return (
        <>
            <DashboardStats
                greeting={`${user.firstName} ${user.lastName}`}
                role={user.role}
                stats={stats}
            />
            <EngagementChart data={stats.engagementData} />
        </>
    );
}
