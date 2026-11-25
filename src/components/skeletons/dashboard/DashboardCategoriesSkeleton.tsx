import { Skeleton } from "@/components/ui/skeleton";

/** Route-level skeleton for /dashboard/manage-categories. */
export default function DashboardCategoriesSkeleton() {
    return (
        <div
            className="space-y-6"
            data-testid="dashboard-categories-skeleton"
            aria-busy="true"
        >
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div className="space-y-2">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-8 w-44" />
                    <Skeleton className="h-4 w-80" />
                </div>
                <Skeleton className="h-8 w-36 rounded-md" />
            </div>

            <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <Skeleton className="h-10 w-full max-w-sm rounded-lg" />
                    <Skeleton className="h-9 w-32 rounded-lg" />
                </div>
                <div className="mt-5 space-y-2">
                    {Array.from({ length: 7 }).map((_, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-3 rounded-xl border border-border/60 px-4 py-3"
                        >
                            <Skeleton className="h-8 w-8 rounded-lg" />
                            <Skeleton className="h-4 w-40" />
                            <Skeleton className="ml-auto h-5 w-16 rounded-full" />
                            <Skeleton className="h-8 w-8 rounded-md" />
                            <Skeleton className="h-8 w-8 rounded-md" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
