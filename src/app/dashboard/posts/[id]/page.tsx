import { notFound } from "next/navigation";
import { prisma } from "@/utils/prisma";
import { getDashboardUser } from "@/utils/dashboardAuth";
import PostFormPage from "@/components/dashboard/posts/PostFormPage";

export const dynamic = "force-dynamic";

export const metadata = { title: "Edit post" };

export default async function EditPostPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const user = await getDashboardUser(["ADMIN", "AUTHOR"]);

    const post = await prisma.post.findFirst({
        where:
            user.role === "ADMIN"
                ? { id }
                : { id, OR: [{ authorId: user.id }, { published: true }] },
    });

    if (!post) notFound();

    return (
        <PostFormPage
            mode="edit"
            post={{
                id: post.id,
                title: post.title,
                content: post.content,
                published: post.published,
                categoryId: post.categoryId,
                images: post.images,
            }}
        />
    );
}
