import { Skeleton } from "@/components/ui/skeleton";

export default function ReadMoreSkeleton() {
    return (
        <section
            className="mt-14 border-t border-border pt-10"
            data-testid="read-more-skeleton"
            aria-hidden="true"
        >
            <Skeleton className="mb-8 h-8 w-36" />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div
                        key={i}
                        className="overflow-hidden rounded-2xl border border-border/80 bg-card"
                    >
                        <Skeleton className="aspect-[16/10] w-full rounded-none" />
                        <div className="space-y-2 p-5">
                            <Skeleton className="h-3 w-20" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-2/3" />
                            <Skeleton className="h-3 w-28" />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
