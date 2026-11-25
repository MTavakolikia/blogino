import { Skeleton } from "@/components/ui/skeleton";

/** Just the comment rows — used inside the live comments section. */
export function CommentListSkeleton({ rows = 3 }: { rows?: number }) {
    return (
        <div
            className="space-y-6"
            data-testid="comments-skeleton"
            aria-hidden="true"
        >
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex gap-3">
                    <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
                    <div className="flex-1 space-y-2 py-1">
                        <Skeleton className="h-3.5 w-32" />
                        <Skeleton className="h-3.5 w-3/4" />
                        <Skeleton className="h-3.5 w-1/2" />
                    </div>
                </div>
            ))}
        </div>
    );
}

/** Full comments block for route-level skeletons. */
export default function CommentsSkeleton() {
    return (
        <section
            className="mt-12 border-t border-border pt-10"
            data-testid="comments-block-skeleton"
            aria-hidden="true"
        >
            <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-6 rounded-md" />
                <Skeleton className="h-7 w-32" />
            </div>

            <div className="mt-6 flex gap-3">
                <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-20 w-full rounded-xl" />
                    <div className="flex justify-end">
                        <Skeleton className="h-8 w-32 rounded-lg" />
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <CommentListSkeleton />
            </div>
        </section>
    );
}
