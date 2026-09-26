import Link from "next/link";
import { prisma } from "@/utils/prisma";
import { getDashboardUser } from "@/utils/dashboardAuth";
import { SectionHeading } from "@/components/root/SectionHeading";
import { Button } from "@/components/ui/button";
import CategoryManager from "@/components/dashboard/categories/CategoryManager";

export const dynamic = "force-dynamic";

export const metadata = { title: "Categories" };

async function getCategories() {
    return prisma.category.findMany({
        orderBy: { name: "asc" },
        include: { _count: { select: { posts: true } } },
    });
}

export default async function ManageCategoriesPage() {
    await getDashboardUser(["ADMIN", "AUTHOR"]);
    const categories = await getCategories();

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <SectionHeading
                    eyebrow="Content"
                    title="Categories"
                    description="Organize your articles by topic. Authors can create and rename; only admins can delete."
                />
                <Button asChild variant="ghost" size="sm">
                    <Link href="/post">View public archive →</Link>
                </Button>
            </div>

            <CategoryManager
                initialCategories={categories.map((c) => ({
                    id: c.id,
                    name: c.name,
                    posts: c._count.posts,
                    createdAt: c.createdAt.toISOString(),
                }))}
            />
        </div>
    );
}
