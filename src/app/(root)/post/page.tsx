import { prisma } from "@/utils/prisma";
import PostsList from "@/components/posts/PostsList";
import CategorySidebar from "@/components/posts/CategorySidebar";

const POSTS_PER_PAGE = 6;

async function getCategories() {
    return await prisma.category.findMany({
        orderBy: { name: "asc" },
        include: {
            _count: {
                select: {
                    posts: {
                        where: {
                            published: true
                        }
                    },
                },
            },
        },
    });
}

async function getRecentPosts() {
    const posts = await prisma.post.findMany({
        where: { published: true },
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            title: true,
            createdAt: true,
        },
    });

    return posts.map(post => ({
        ...post,
        createdAt: post.createdAt.toISOString()
    }));
}

async function getPosts(page: number = 1, categoryId: string | null = null) {
    const skip = (page - 1) * POSTS_PER_PAGE;

    const where = {
        published: true,
        ...(categoryId && { categoryId: categoryId }),
    };


    const [posts, total] = await Promise.all([
        prisma.post.findMany({
            where,
            skip,
            take: POSTS_PER_PAGE,
            orderBy: {
                createdAt: "desc",
            },
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
            },
        }),
        prisma.post.count({ where }),
    ]);


    return {
        posts: posts.map(post => ({
            ...post,
            createdAt: post.createdAt.toISOString(),
            updatedAt: post.updatedAt.toISOString(),
            approvedAt: post.approvedAt?.toISOString() || null,
        })),
        totalPages: Math.ceil(total / POSTS_PER_PAGE),
    };
}

export default async function PostPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; category?: string }>
}) {
    const params = await searchParams
    const page = Number(params.page) || 1;
    const categoryId = params.category || null;

    const [categories, recentPosts, { posts, totalPages }] = await Promise.all([
        getCategories(),
        getRecentPosts(),
        getPosts(page, categoryId),
    ]);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="md:col-span-3">
                    <PostsList
                        initialPosts={posts}
                        totalPages={totalPages}
                        currentPage={page}
                        selectedCategory={categoryId}
                    />
                </div>
                <CategorySidebar
                    categories={categories}
                    recentPosts={recentPosts}
                    selectedCategory={categoryId}
                />
            </div>
        </div>
    );
}