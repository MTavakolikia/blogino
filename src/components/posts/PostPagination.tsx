"use client";

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PostPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    disabled?: boolean;
}

type PageItem = number | "ellipsis-left" | "ellipsis-right";

function getPageItems(current: number, total: number): PageItem[] {
    if (total <= 7) {
        return Array.from({ length: total }, (_, i) => i + 1);
    }
    if (current <= 4) {
        return [1, 2, 3, 4, 5, "ellipsis-right", total];
    }
    if (current >= total - 3) {
        return [
            1,
            "ellipsis-left",
            total - 4,
            total - 3,
            total - 2,
            total - 1,
            total,
        ];
    }
    return [
        1,
        "ellipsis-left",
        current - 1,
        current,
        current + 1,
        "ellipsis-right",
        total,
    ];
}

export default function PostPagination({
    currentPage,
    totalPages,
    onPageChange,
    disabled = false,
}: PostPaginationProps) {
    const items = getPageItems(currentPage, totalPages);

    return (
        <nav
            aria-label="Pagination"
            className="flex flex-wrap items-center justify-center gap-1.5 pt-2"
        >
            <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={disabled || currentPage === 1}
                aria-label="Previous page"
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>

            {items.map((item) =>
                typeof item === "number" ? (
                    <Button
                        key={item}
                        variant={item === currentPage ? "default" : "outline"}
                        size="icon"
                        onClick={() => onPageChange(item)}
                        disabled={disabled}
                        aria-label={`Page ${item}`}
                        aria-current={item === currentPage ? "page" : undefined}
                        className={cn(
                            "tabular-nums",
                            item === currentPage &&
                                "pointer-events-none shadow-sm shadow-primary/25",
                        )}
                    >
                        {item}
                    </Button>
                ) : (
                    <span
                        key={item}
                        aria-hidden
                        className="flex h-9 w-9 items-center justify-center text-muted-foreground"
                    >
                        <MoreHorizontal className="h-4 w-4" />
                    </span>
                ),
            )}

            <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={disabled || currentPage === totalPages}
                aria-label="Next page"
            >
                <ChevronRight className="h-4 w-4" />
            </Button>
        </nav>
    );
}
