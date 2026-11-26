import { Skeleton } from "@/components/ui/skeleton";
import CategoryFilterSkeleton from "@/components/skeletons/CategoryFilterSkeleton";
import PostsGridSkeleton from "@/components/skeletons/PostsGridSkeleton";
import SidebarSkeleton from "@/components/skeletons/SidebarSkeleton";

/** Route-level skeleton for the /post archive. */
export default function PostArchiveSkeleton() {
    return (
        <div className="relative" data-testid="archive-skeleton" aria-busy="true">
            <div className="border-b border-border/60">
                <div className="relative mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
                    <Skeleton className="h-9 w-56 md:h-10" />
                    <Skeleton className="mt-3 h-4 w-64" />
                </div>
            </div>

            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-10 md:px-6 lg:grid-cols-[1fr_300px]">
                <div className="min-w-0 space-y-6">
                    <CategoryFilterSkeleton />
                    <PostsGridSkeleton count={9} />

                    <div className="flex items-center justify-center gap-2 pt-2">
                        <Skeleton className="h-9 w-9 rounded-lg" />
                        <Skeleton className="h-9 w-32 rounded-lg" />
                        <Skeleton className="h-9 w-9 rounded-lg" />
                    </div>
                </div>

                <aside className="hidden lg:block">
                    <SidebarSkeleton />
                </aside>
            </div>
        </div>
    );
}
