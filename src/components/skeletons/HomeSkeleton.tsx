import { Skeleton } from "@/components/ui/skeleton";
import CategoryFilterSkeleton from "@/components/skeletons/CategoryFilterSkeleton";
import PostsGridSkeleton from "@/components/skeletons/PostsGridSkeleton";

/** Route-level skeleton for the home page. */
export default function HomeSkeleton() {
    return (
        <div className="relative" data-testid="home-skeleton" aria-busy="true">
            {/* Hero */}
            <div className="relative overflow-hidden border-b border-border/60">
                <div className="relative mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
                    <Skeleton className="h-6 w-44 rounded-full" />

                    <div className="mt-5 space-y-3">
                        <Skeleton className="h-11 w-full max-w-2xl md:h-16" />
                        <Skeleton className="h-11 w-3/4 max-w-xl md:h-16" />
                    </div>

                    <div className="mt-6 space-y-2.5">
                        <Skeleton className="h-4 w-full max-w-xl" />
                        <Skeleton className="h-4 w-2/3 max-w-md" />
                    </div>

                    <div className="mt-9 flex flex-wrap items-center gap-8">
                        <Skeleton className="h-11 w-36 rounded-xl" />
                        <div className="flex items-center gap-6">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="flex items-center gap-6">
                                    {i > 0 && <Skeleton className="h-8 w-px" />}
                                    <div className="space-y-1.5">
                                        <Skeleton className="h-7 w-10" />
                                        <Skeleton className="h-3 w-16" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Latest posts */}
            <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
                <div className="mb-6 flex items-end justify-between gap-4">
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-52" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                    <Skeleton className="hidden h-4 w-20 sm:block" />
                </div>

                <div className="space-y-6">
                    <CategoryFilterSkeleton />
                    <PostsGridSkeleton count={6} featured />
                </div>
            </div>
        </div>
    );
}
