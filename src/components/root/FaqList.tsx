"use client";

import { ChevronDown } from "lucide-react";
import * as React from "react";

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

export interface FaqItem {
    question: string;
    answer: string;
}

export function FaqList({ items }: { items: FaqItem[] }) {
    return (
        <div className="divide-y divide-border/70 rounded-2xl border border-border/70 bg-card shadow-sm">
            {items.map((item) => (
                <FaqRow key={item.question} item={item} />
            ))}
        </div>
    );
}

function FaqRow({ item }: { item: FaqItem }) {
    const [open, setOpen] = React.useState(false);

    return (
        <Collapsible open={open} onOpenChange={setOpen}>
            <CollapsibleTrigger
                aria-expanded={open}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium transition-colors hover:bg-muted/40 md:px-6"
            >
                {item.question}
                <ChevronDown
                    className={cn(
                        "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300",
                        open && "rotate-180",
                    )}
                />
            </CollapsibleTrigger>
            <CollapsibleContent>
                <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground md:px-6">
                    {item.answer}
                </p>
            </CollapsibleContent>
        </Collapsible>
    );
}
