import { Skeleton } from "@/components/ui/skeleton";

/** Route-level skeleton for /dashboard/posts. */
export default function DashboardPostsSkeleton() {
    return (
        <div
            className="space-y-6"
            data-testid="dashboard-posts-skeleton"
            aria-busy="true"
        >
            <div className="space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-4 w-80" />
            </div>

            <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <Skeleton className="h-9 w-64 rounded-lg" />
                    <Skeleton className="h-10 w-full max-w-xs rounded-lg" />
                </div>

                <div className="space-y-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div
                            key={i}
                            className="flex flex-wrap items-center gap-4 rounded-xl border border-border/70 bg-card p-4 shadow-sm"
                        >
                            <Skeleton className="h-14 w-20 shrink-0 rounded-lg" />
                            <div className="min-w-0 flex-1 space-y-2">
                                <div className="flex gap-2">
                                    <Skeleton className="h-4 w-20 rounded-full" />
                                    <Skeleton className="h-4 w-24 rounded-full" />
                                </div>
                                <Skeleton className="h-4 w-2/3" />
                                <Skeleton className="h-3 w-48" />
                            </div>
                            <div className="flex items-center gap-1">
                                {Array.from({ length: 4 }).map((_, j) => (
                                    <Skeleton key={j} className="h-8 w-8 rounded-md" />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
