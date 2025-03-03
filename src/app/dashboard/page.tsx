import DashboardStats from "@/components/dashboard/DashboardStats";
import LineChartComponent from "@/components/dashboard/LineChartComponent";
import { prisma } from "@/utils/prisma";
import { cookies } from "next/headers";

async function getStats() {
    const userCookie = await cookies().get("user");
    if (!userCookie) throw new Error("User not authenticated");

    const user = JSON.parse(userCookie.value);
    const userId = user.id;

    const [
        activePosts,
        inactivePosts,
        categories,
        likes,
        comments,
        likesByMonth,
        commentsByMonth,
    ] = await Promise.all([
        prisma.post.count({ where: { published: true, authorId: userId } }),
        prisma.post.count({ where: { published: false, authorId: userId } }),
        prisma.category.count(),
        prisma.like.count({ where: { userId } }),
        prisma.comment.count({ where: { userId } }),
        prisma.like.groupBy({
            by: ["createdAt"],
            _count: { id: true },
            where: { userId },
        }),
        prisma.comment.groupBy({
            by: ["createdAt"],
            _count: { id: true },
            where: { userId },
        }),
    ]);

    const engagementData = Array.from({ length: 12 }, (_, i) => {
        const month = new Date(0, i).toLocaleString("en-US", { month: "long" });

        return {
            month,
            likes: likesByMonth.find((l) => new Date(l.createdAt).getMonth() === i)?._count.id || 0,
            comments: commentsByMonth.find((c) => new Date(c.createdAt).getMonth() === i)?._count.id || 0,
            activePosts,
            inactivePosts,
        };
    });

    return { activePosts, inactivePosts, categories, likes, comments, engagementData };
}



export default async function DashboardPage() {

    const stats = await getStats();

    return (
        <>
            <DashboardStats stats={stats} />

            <div className="col-span-2 mt-6">
                <LineChartComponent
                    title="User Engagement"
                    description="Monthly Likes, Comments, Active and Inactive Posts"
                    data={stats.engagementData}
                    config={{
                        likes: { label: "Likes", color: "hsl(var(--chart-1))" },
                        comments: { label: "Comments", color: "hsl(var(--chart-2))" },
                        activePosts: { label: "Active Posts", color: "green" },  // Active posts color
                        inactivePosts: { label: "Inactive Posts", color: "orange" },  // Inactive posts color
                    }}
                    xAxisKey="month"
                    lines={[
                        { dataKey: "likes", color: "red" },
                        { dataKey: "comments", color: "blue" },
                        { dataKey: "activePosts", color: "green" },  // Active posts line
                        { dataKey: "inactivePosts", color: "orange" },  // Inactive posts line
                    ]}
                    footerText="Increasing trend of user engagement and post status"
                />
            </div>
        </>
    );
}
