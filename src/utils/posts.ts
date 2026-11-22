import type { PostCardPost } from "@/components/posts/PostCard";

export type PostCardSource = {
    id: string;
    title: string;
    content: string;
    images: string[];
    createdAt: Date | string;
    author: { firstName: string; lastName: string } | null;
    category: { name: string } | null;
    _count: { likes: number };
};

export function toPostCard(post: PostCardSource): PostCardPost {
    return {
        id: post.id,
        title: post.title,
        content: post.content,
        images: post.images,
        createdAt: new Date(post.createdAt).toISOString(),
        author: post.author,
        category: post.category,
        _count: post._count,
    };
}

export function normalizePage(value: unknown): number {
    const page = Number(value);
    if (!Number.isFinite(page) || page < 1) return 1;
    return Math.floor(page);
}

export function totalPages(count: number, perPage: number): number {
    return Math.max(1, Math.ceil(count / perPage));
}

export function readingTime(content: string): number {
    const words = content.replace(/<[^>]*>/g, " ").trim().split(/\s+/).length;
    return Math.max(1, Math.round(words / 200));
}
