import { Skeleton } from "@/components/ui/skeleton";

/** Route-level skeleton for the post editor (create + edit). */
export default function PostFormSkeleton() {
    return (
        <div
            className="space-y-6"
            data-testid="post-form-skeleton"
            aria-busy="true"
        >
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div className="space-y-2">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-8 w-52" />
                    <Skeleton className="h-4 w-72" />
                </div>
                <div className="flex gap-2">
                    <Skeleton className="h-9 w-24 rounded-lg" />
                    <Skeleton className="h-9 w-28 rounded-lg" />
                </div>
            </div>

            <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm md:p-6">
                <div className="space-y-5">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-11 w-full rounded-lg" />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-10 w-full rounded-lg" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-10 w-full rounded-lg" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-12 w-full rounded-lg" />
                    </div>

                    <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-72 w-full rounded-xl" />
                    </div>
                </div>
            </div>
        </div>
    );
}
