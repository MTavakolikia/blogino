import { Skeleton } from "@/components/ui/skeleton";

/** Route-level skeleton for /dashboard (stats + chart). */
export default function DashboardOverviewSkeleton() {
    return (
        <div
            className="space-y-6"
            data-testid="dashboard-overview-skeleton"
            aria-busy="true"
        >
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div className="space-y-2">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-4 w-72" />
                </div>
                <Skeleton className="h-9 w-40 rounded-lg" />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div
                        key={i}
                        className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm"
                    >
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="h-5 w-5 rounded-md" />
                        </div>
                        <Skeleton className="mt-4 h-8 w-16" />
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div
                        key={i}
                        className="flex items-center justify-between rounded-xl border border-border/70 bg-card px-4 py-3 shadow-sm"
                    >
                        <div className="flex items-center gap-2.5">
                            <Skeleton className="h-4 w-4 rounded" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                        <Skeleton className="h-3.5 w-3.5 rounded" />
                    </div>
                ))}
            </div>

            <div className="rounded-xl border border-border/70 bg-card shadow-sm">
                <div className="space-y-2 p-6">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-4 w-full max-w-lg" />
                </div>
                <div className="px-6">
                    <Skeleton className="h-72 w-full rounded-lg" />
                </div>
                <div className="mt-5 flex items-center gap-2 border-t border-border/60 p-5">
                    <Skeleton className="h-4 w-4 rounded" />
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="ml-auto h-3 w-44" />
                </div>
            </div>
        </div>
    );
}
