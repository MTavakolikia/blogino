import { Skeleton } from "@/components/ui/skeleton";

/** Route-level skeleton for /dashboard/settings. */
export default function DashboardSettingsSkeleton() {
    return (
        <div
            className="mx-auto max-w-2xl space-y-6"
            data-testid="dashboard-settings-skeleton"
            aria-busy="true"
        >
            <div className="space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-8 w-36" />
                <Skeleton className="h-4 w-80" />
            </div>

            {Array.from({ length: 2 }).map((_, card) => (
                <div
                    key={card}
                    className="rounded-xl border border-border/70 bg-card shadow-sm"
                >
                    <div className="space-y-2 p-6 pb-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                    <div className="space-y-4 p-6 pt-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-10 w-full rounded-lg" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-10 w-full rounded-lg" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-10 w-full rounded-lg" />
                        </div>
                        <div className="flex justify-end">
                            <Skeleton className="h-10 w-32 rounded-lg" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
