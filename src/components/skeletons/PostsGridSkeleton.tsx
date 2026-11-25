import PostCardSkeleton from "@/components/skeletons/PostCardSkeleton";
import { cn } from "@/lib/utils";

export default function PostsGridSkeleton({
    count = 6,
    featured = false,
    className,
}: {
    count?: number;
    featured?: boolean;
    className?: string;
}) {
    return (
        <div
            data-testid="posts-grid-skeleton"
            role="status"
            aria-live="polite"
            aria-label="Loading articles"
            className={cn(
                "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3",
                className,
            )}
        >
            {Array.from({ length: count }).map((_, i) => (
                <PostCardSkeleton key={i} featured={featured && i === 0} />
            ))}
            <span className="sr-only">Loading articles…</span>
        </div>
    );
}
