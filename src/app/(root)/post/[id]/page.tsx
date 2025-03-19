import { prisma } from "@/utils/prisma";
import { notFound } from "next/navigation";
import PostContent from "@/components/posts/PostContent";
import LikeButton from "@/components/posts/LikeButton";

interface SinglePostPageProps {
    params: {
        id: string;
    };
}

export default async function SinglePostPage({ params }: SinglePostPageProps) {
    const resolvedParams = await Promise.resolve(params);
    const post = await prisma.post.findUnique({
        where: { id: resolvedParams.id },
        include: {
            author: {
                select: {
                    firstName: true,
                    lastName: true,
                },
            },
            category: {
                select: {
                    name: true,
                },
            },
            _count: {
                select: {
                    likes: true,
                },
            },
        },
    });

    if (!post) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4 text-gray-600">
                        <span>By {post.author.firstName} {post.author.lastName}</span>
                        <span>•</span>
                        <span>{post.category?.name}</span>
                        <span>•</span>
                        <span>{new Date(post.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}</span>
                    </div>
                    <LikeButton
                        postId={post.id}
                        initialLikeCount={post._count.likes}
                    />
                </div>
                <div className="prose max-w-none">
                    <PostContent content={post.content} />
                </div>
            </div>
        </div>
    );
} 