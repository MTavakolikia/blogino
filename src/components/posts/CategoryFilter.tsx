"use client";

import { SlidersHorizontal } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export interface CategoryOption {
    id: string;
    name: string;
    count: number;
}

interface CategoryFilterProps {
    categories: CategoryOption[];
    selected: string | null;
    onSelect: (id: string | null) => void;
}

function Chip({
    name,
    count,
    active,
    onClick,
}: {
    name: string;
    count?: number;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={active}
            className={cn(
                "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-sm font-medium transition-all",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                active
                    ? "border-primary bg-primary text-primary-foreground shadow-sm shadow-primary/30"
                    : "border-border bg-background/60 text-muted-foreground hover:border-foreground/30 hover:text-foreground",
            )}
        >
            <span className="truncate">{name}</span>
            {typeof count === "number" && (
                <span
                    className={cn(
                        "rounded-full px-1.5 py-0.5 text-xs font-semibold tabular-nums",
                        active
                            ? "bg-primary-foreground/20 text-primary-foreground"
                            : "bg-muted text-muted-foreground",
                    )}
                >
                    {count}
                </span>
            )}
        </button>
    );
}

export default function CategoryFilter({
    categories,
    selected,
    onSelect,
}: CategoryFilterProps) {
    const options = [
        { id: null as string | null, name: "All", count: undefined },
        ...categories.map((c) => ({ id: c.id, name: c.name, count: c.count })),
    ];

    const selectedName =
        options.find((o) => o.id === selected)?.name ?? "All";

    // Desktop: horizontally scrollable row of chips
    return (
        <div>
            <div className="hidden flex-wrap items-center gap-2 md:flex">
                {options.map((o) => (
                    <Chip
                        key={o.name}
                        name={o.name}
                        count={o.count}
                        active={selected === o.id}
                        onClick={() => onSelect(o.id)}
                    />
                ))}
            </div>

            {/* Mobile: bottom sheet */}
            <Sheet>
                <SheetTrigger asChild>
                    <button
                        type="button"
                        className="flex h-11 w-full items-center justify-between rounded-xl border border-border bg-background/60 px-4 text-sm font-medium md:hidden"
                    >
                        <span className="flex items-center gap-2">
                            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                            {selectedName}
                        </span>
                        <span className="text-xs text-muted-foreground">
                            Filter
                        </span>
                    </button>
                </SheetTrigger>
                <SheetContent side="bottom" className="rounded-t-2xl">
                    <SheetHeader className="text-left">
                        <SheetTitle>Filter by category</SheetTitle>
                        <SheetDescription>
                            Choose a category to narrow the articles.
                        </SheetDescription>
                    </SheetHeader>
                    <div className="flex flex-wrap gap-2 p-5">
                        {options.map((o) => (
                            <Chip
                                key={o.name}
                                name={o.name}
                                count={o.count}
                                active={selected === o.id}
                                onClick={() => onSelect(o.id)}
                            />
                        ))}
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}
