import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/**
 * Mirrors the layout of <PostCard /> so the swap from loading to content
 * doesn't shift the page. `featured` matches the wide first card.
 */
export default function PostCardSkeleton({
    className,
    featured = false,
}: {
    className?: string;
    featured?: boolean;
}) {
    return (
        <div
            data-testid="post-card-skeleton"
            className={cn(
                "overflow-hidden rounded-3xl border border-border/70 bg-card shadow-sm",
                featured && "sm:col-span-2",
                className,
            )}
        >
            <div
                className={cn(
                    "flex h-full flex-col",
                    featured && "md:flex-row",
                )}
            >
                <Skeleton
                    className={cn(
                        "w-full rounded-none",
                        featured
                            ? "aspect-[16/10] md:aspect-auto md:min-h-[280px] md:w-[55%]"
                            : "aspect-[16/10]",
                    )}
                />

                <div
                    className={cn(
                        "flex flex-1 flex-col gap-3 p-5",
                        featured && "md:justify-center md:p-7",
                    )}
                >
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-5 w-20 rounded-full" />
                        <Skeleton className="h-5 w-16 rounded-full" />
                    </div>

                    <Skeleton className={cn("w-full", featured ? "h-7" : "h-5")} />
                    <Skeleton className={cn("w-4/5", featured ? "h-7" : "h-5")} />

                    <div className="mt-1 space-y-2">
                        <Skeleton className="h-3.5 w-full" />
                        <Skeleton className="h-3.5 w-11/12" />
                        <Skeleton className="h-3.5 w-2/3" />
                    </div>

                    <div className="mt-auto flex items-center justify-between gap-3 border-t border-border/60 pt-3">
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-6 w-6 rounded-full" />
                            <Skeleton className="h-3 w-24" />
                        </div>
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-6 w-12 rounded-full" />
                            <Skeleton className="h-7 w-7 rounded-full" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
