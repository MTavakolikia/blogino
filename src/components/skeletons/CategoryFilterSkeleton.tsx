import { Skeleton } from "@/components/ui/skeleton";

const CHIP_WIDTHS = ["w-16", "w-36", "w-24", "w-32", "w-28", "w-36", "w-24", "w-28"];

export default function CategoryFilterSkeleton() {
    return (
        <div data-testid="category-filter-skeleton" aria-hidden="true">
            {/* Desktop chips */}
            <div className="hidden flex-wrap items-center gap-2 md:flex">
                {CHIP_WIDTHS.map((width, i) => (
                    <Skeleton
                        key={i}
                        className={`h-9 rounded-full ${width}`}
                    />
                ))}
            </div>

            {/* Mobile filter trigger */}
            <Skeleton className="h-11 w-full rounded-xl md:hidden" />
        </div>
    );
}
