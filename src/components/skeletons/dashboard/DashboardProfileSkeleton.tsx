import { Skeleton } from "@/components/ui/skeleton";

/** Route-level skeleton for /dashboard/profile and /dashboard/profile/[id]. */
export default function DashboardProfileSkeleton() {
    return (
        <div
            className="space-y-6"
            data-testid="dashboard-profile-skeleton"
            aria-busy="true"
        >
            <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
                <div className="flex flex-wrap items-center gap-5 p-6">
                    <Skeleton className="h-20 w-20 rounded-2xl" />
                    <div className="min-w-0 flex-1 space-y-3">
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-7 w-48" />
                            <Skeleton className="h-5 w-16 rounded-full" />
                        </div>
                        <Skeleton className="h-4 w-64" />
                        <Skeleton className="h-4 w-48" />
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-4 border-t border-border/60 p-6">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div
                            key={i}
                            className="flex flex-col items-center gap-2"
                        >
                            <Skeleton className="h-4 w-4 rounded" />
                            <Skeleton className="h-6 w-10" />
                            <Skeleton className="h-3 w-20" />
                        </div>
                    ))}
                </div>
            </div>

            <div className="rounded-xl border border-border/70 bg-card shadow-sm">
                <div className="flex items-center justify-between p-6 pb-3">
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-52" />
                    </div>
                    <Skeleton className="h-8 w-20 rounded-md" />
                </div>
                <div className="space-y-2 px-6 pb-6">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div
                            key={i}
                            className="flex items-center justify-between gap-4 rounded-lg px-3 py-2.5"
                        >
                            <div className="min-w-0 flex-1 space-y-2">
                                <Skeleton className="h-4 w-2/3" />
                                <Skeleton className="h-3 w-40" />
                            </div>
                            <Skeleton className="h-3 w-16" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
