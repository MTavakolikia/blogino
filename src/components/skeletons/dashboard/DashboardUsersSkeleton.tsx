import { Skeleton } from "@/components/ui/skeleton";

/** Route-level skeleton for /dashboard/user-management. */
export default function DashboardUsersSkeleton() {
    return (
        <div
            className="space-y-6"
            data-testid="dashboard-users-skeleton"
            aria-busy="true"
        >
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div className="space-y-2">
                    <Skeleton className="h-3 w-28" />
                    <Skeleton className="h-8 w-56" />
                    <Skeleton className="h-4 w-64" />
                </div>
                <Skeleton className="h-9 w-36 rounded-lg" />
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div
                        key={i}
                        className="flex flex-col rounded-2xl border border-border/70 bg-card p-5 shadow-sm"
                    >
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-12 w-12 rounded-xl" />
                            <div className="min-w-0 flex-1 space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-40" />
                            </div>
                            <Skeleton className="h-5 w-14 rounded-full" />
                        </div>
                        <div className="mt-4 flex gap-4">
                            <Skeleton className="h-3 w-28" />
                            <Skeleton className="h-3 w-16" />
                        </div>
                        <div className="mt-4 flex items-center gap-2 border-t border-border/60 pt-4">
                            <Skeleton className="h-8 w-20 rounded-md" />
                            <Skeleton className="h-8 w-20 rounded-md" />
                            <Skeleton className="ml-auto h-8 w-8 rounded-md" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
