import { Skeleton } from "@/components/ui/skeleton";

/** Route-level skeleton for /contact-me. */
export default function ContactSkeleton() {
    return (
        <div className="relative" data-testid="contact-skeleton" aria-busy="true">
            {/* Hero */}
            <div className="border-b border-border/60">
                <div className="relative mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
                    <Skeleton className="h-6 w-28 rounded-full" />
                    <div className="mt-5 space-y-3">
                        <Skeleton className="h-11 w-full max-w-2xl md:h-16" />
                        <Skeleton className="h-11 w-1/2 max-w-md md:h-16" />
                    </div>
                    <div className="mt-6 space-y-2.5">
                        <Skeleton className="h-4 w-full max-w-xl" />
                        <Skeleton className="h-4 w-3/4 max-w-lg" />
                    </div>
                </div>
            </div>

            {/* Cards + form */}
            <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 md:px-6 md:py-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-8">
                <div className="flex flex-col gap-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div
                            key={i}
                            className="rounded-2xl border border-border/70 bg-card p-6"
                        >
                            <Skeleton className="h-6 w-6 rounded-lg" />
                            <Skeleton className="mt-4 h-5 w-36" />
                            <Skeleton className="mt-2 h-4 w-full" />
                            <Skeleton className="mt-1.5 h-4 w-4/5" />
                            {i === 0 && (
                                <div className="mt-5 flex items-center justify-between">
                                    <Skeleton className="h-4 w-36" />
                                    <Skeleton className="h-8 w-24 rounded-lg" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="rounded-2xl border border-border/70 bg-card p-6 md:p-8">
                    <Skeleton className="h-7 w-44" />
                    <Skeleton className="mt-2 h-4 w-64" />
                    <div className="mt-6 space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-10 w-full rounded-lg" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-10 w-full rounded-lg" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-10 w-full rounded-lg" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-32 w-full rounded-lg" />
                        </div>
                        <Skeleton className="h-10 w-36 rounded-lg" />
                    </div>
                </div>
            </div>
        </div>
    );
}
