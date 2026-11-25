import { Skeleton } from "@/components/ui/skeleton";

/** Shared skeleton for saved / liked posts pages (header + activity cards). */
export default function ActivityListSkeleton({
    titleWidth = "w-48",
}: {
    titleWidth?: string;
}) {
    return (
        <div
            className="space-y-6"
            data-testid="activity-list-skeleton"
            aria-busy="true"
        >
            <div className="space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className={`h-8 ${titleWidth}`} />
                <Skeleton className="h-4 w-64" />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div
                        key={i}
                        className="overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm"
                    >
                        <div className="flex items-center justify-between gap-4 p-4">
                            <div className="flex min-w-0 items-center gap-3">
                                <Skeleton className="h-14 w-20 shrink-0 rounded-lg" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-40" />
                                    <Skeleton className="h-3 w-32" />
                                </div>
                            </div>
                            <Skeleton className="h-6 w-16 rounded-full" />
                        </div>
                        <div className="space-y-2 px-4 pb-4">
                            <Skeleton className="h-3.5 w-full" />
                            <Skeleton className="h-3.5 w-4/5" />
                            <div className="flex items-center justify-between pt-1">
                                <Skeleton className="h-3 w-40" />
                                <Skeleton className="h-4 w-16" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
