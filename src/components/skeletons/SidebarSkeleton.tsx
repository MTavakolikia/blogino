import { Skeleton } from "@/components/ui/skeleton";

/** Sidebar for the archive page: recent list + most-viewed list. */
export default function SidebarSkeleton() {
    return (
        <div className="space-y-6" data-testid="sidebar-skeleton" aria-hidden="true">
            <div className="rounded-2xl border border-border/70 bg-card p-6">
                <Skeleton className="h-4 w-20" />
                <div className="mt-5 space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="space-y-1.5">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-3 w-24" />
                        </div>
                    ))}
                </div>
            </div>

            <div className="rounded-2xl border border-border/70 bg-muted/30 p-6">
                <Skeleton className="h-4 w-28" />
                <div className="mt-5 space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-start gap-3">
                            <Skeleton className="h-5 w-4 rounded" />
                            <Skeleton className="h-4 flex-1" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
