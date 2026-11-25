import { Skeleton } from "@/components/ui/skeleton";
import CommentsSkeleton from "@/components/skeletons/CommentsSkeleton";
import ReadMoreSkeleton from "@/components/skeletons/ReadMoreSkeleton";

/** Route-level skeleton for a single article. */
export default function ArticleSkeleton() {
    return (
        <article
            className="relative"
            data-testid="article-skeleton"
            aria-busy="true"
        >
            {/* Hero */}
            <div className="relative overflow-hidden border-b border-border/60">
                <div className="relative mx-auto max-w-3xl px-4 py-8 md:px-6 md:py-12">
                    <div className="mb-5 flex flex-wrap items-center gap-4">
                        <Skeleton className="h-9 w-9 rounded-full" />
                        <Skeleton className="h-6 w-24 rounded-md" />
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-20" />
                    </div>

                    <div className="space-y-3">
                        <Skeleton className="h-10 w-full md:h-14" />
                        <Skeleton className="h-10 w-4/5 md:h-14" />
                    </div>

                    <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-20" />
                            </div>
                        </div>
                        <Skeleton className="h-4 w-24" />
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-10 md:px-6 lg:grid-cols-[1fr_320px] lg:py-14">
                <div className="min-w-0 max-w-3xl">
                    <Skeleton className="mb-8 aspect-[16/9] w-full rounded-2xl" />

                    <div className="space-y-3">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-11/12" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-10/12" />
                        <Skeleton className="h-4 w-2/3" />
                        <Skeleton className="mt-6 h-6 w-52" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-9/12" />
                        <Skeleton className="h-4 w-11/12" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>

                    <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-8">
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-9 w-24 rounded-full" />
                            <Skeleton className="h-9 w-9 rounded-full" />
                        </div>
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-9 w-9 rounded-full" />
                            <Skeleton className="h-9 w-9 rounded-full" />
                            <Skeleton className="h-9 w-9 rounded-full" />
                        </div>
                    </div>

                    <CommentsSkeleton />
                    <ReadMoreSkeleton />
                </div>

                <aside className="hidden lg:block">
                    <div className="sticky top-24 space-y-5">
                        <div className="rounded-2xl border border-border/70 bg-card p-6">
                            <Skeleton className="h-4 w-24" />
                            <div className="mt-5 flex items-center gap-3">
                                <Skeleton className="h-12 w-12 rounded-full" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-28" />
                                    <Skeleton className="h-3 w-20" />
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-border/70 bg-muted/30 p-6">
                            <Skeleton className="h-4 w-32" />
                            <div className="mt-5 space-y-3">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <Skeleton key={i} className="h-4 w-full" />
                                ))}
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </article>
    );
}
