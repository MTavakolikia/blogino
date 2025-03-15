import { prisma } from "@/utils/prisma";
import { notFound } from "next/navigation";
import PostContent from "@/components/posts/PostContent";

interface PostPageProps {
    params: {
        id: string;
    };
}

export default async function PostPage({ params }: PostPageProps) {
    const post = await prisma.post.findUnique({
        where: { id: params.id },
        include: {
            author: {
                select: {
                    firstName: true,
                    lastName: true,
                    profilePic: true,
                },
            },
            category: true,
        },
    });

    if (!post) {
        notFound();
    }

    return (
        <article className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

                <div className="flex items-center gap-4 text-muted-foreground mb-8">
                    <div className="flex items-center gap-2">
                        <span>نویسنده:</span>
                        <span>{post.author.firstName} {post.author.lastName}</span>
                    </div>
                    {post.category && (
                        <div className="flex items-center gap-2">
                            <span>دسته‌بندی:</span>
                            <span>{post.category.name}</span>
                        </div>
                    )}
                    <div className="flex items-center gap-2">
                        <span>تاریخ:</span>
                        <span>{new Date(post.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}</span>
                    </div>
                </div>

                <div className="prose-container">
                    <PostContent content={post.content} />
                </div>
            </div>
        </article>
    );
} 