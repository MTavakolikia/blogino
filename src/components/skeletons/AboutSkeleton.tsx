import { Skeleton } from "@/components/ui/skeleton";

/** Route-level skeleton for /about-me. */
export default function AboutSkeleton() {
    return (
        <div className="relative" data-testid="about-skeleton" aria-busy="true">
            {/* Hero */}
            <div className="relative overflow-hidden border-b border-border/60">
                <div className="relative mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
                    <Skeleton className="h-6 w-36 rounded-full" />
                    <div className="mt-5 space-y-3">
                        <Skeleton className="h-11 w-full max-w-2xl md:h-16" />
                        <Skeleton className="h-11 w-2/3 max-w-lg md:h-16" />
                    </div>
                    <div className="mt-6 space-y-2.5">
                        <Skeleton className="h-4 w-full max-w-xl" />
                        <Skeleton className="h-4 w-11/12 max-w-lg" />
                        <Skeleton className="h-4 w-2/3 max-w-md" />
                    </div>
                    <div className="mt-8 flex flex-wrap gap-3">
                        <Skeleton className="h-11 w-36 rounded-xl" />
                        <Skeleton className="h-11 w-28 rounded-xl" />
                    </div>
                </div>
            </div>

            {/* Topic marquee */}
            <div className="border-b border-border/60 bg-muted/20 py-5">
                <div className="mx-auto flex max-w-7xl gap-3 overflow-hidden px-4 md:px-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <Skeleton
                            key={i}
                            className="h-8 w-32 shrink-0 rounded-full"
                        />
                    ))}
                </div>
            </div>

            {/* Bento grid */}
            <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-16">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-4 w-full max-w-xl" />
                </div>

                <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-border/70 bg-card p-6 md:col-span-2">
                        <Skeleton className="h-6 w-6 rounded-lg" />
                        <Skeleton className="mt-4 h-5 w-52" />
                        <Skeleton className="mt-2 h-4 w-full" />
                        <Skeleton className="mt-1.5 h-4 w-4/5" />
                        <div className="mt-6 flex gap-10">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="space-y-2">
                                    <Skeleton className="h-7 w-12" />
                                    <Skeleton className="h-3 w-20" />
                                </div>
                            ))}
                        </div>
                    </div>
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div
                            key={i}
                            className="rounded-2xl border border-border/70 bg-card p-6"
                        >
                            <Skeleton className="h-6 w-6 rounded-lg" />
                            <Skeleton className="mt-4 h-5 w-40" />
                            <Skeleton className="mt-2 h-4 w-full" />
                            <Skeleton className="mt-1.5 h-4 w-3/4" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Authors */}
            <div className="border-t border-border/60 bg-muted/20">
                <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-16">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-8 w-64" />
                    </div>
                    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-between gap-4 rounded-2xl border border-border/70 bg-card p-5"
                            >
                                <div className="flex items-center gap-3">
                                    <Skeleton className="h-10 w-10 rounded-full" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-28" />
                                        <Skeleton className="h-3 w-20" />
                                    </div>
                                </div>
                                <Skeleton className="h-6 w-16 rounded-full" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
