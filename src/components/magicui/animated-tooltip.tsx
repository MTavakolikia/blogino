"use client";

import { motion } from "framer-motion";
import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "@/lib/utils";

const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;

/**
 * Tooltip content with a subtle scale/fade entrance.
 * Render a <TooltipCard> (or anything else) inside it.
 */
const TooltipContent = React.forwardRef<
    React.ElementRef<typeof TooltipPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 10, children, ...props }, ref) => (
    <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
            ref={ref}
            sideOffset={sideOffset}
            className={cn("z-50 max-w-xs", className)}
            {...props}
        >
            <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden rounded-xl border border-border/70 bg-popover shadow-lg"
            >
                {children}
            </motion.div>
        </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
));
TooltipContent.displayName = "TooltipContent";

/**
 * A simple title + description body for tooltip cards.
 */
const TooltipCard = ({
    title,
    description,
    className,
}: {
    title: string;
    description: string;
    className?: string;
}) => (
    <div className={cn("flex flex-col gap-1 p-4", className)}>
        <p className="text-sm font-semibold tracking-tight">{title}</p>
        <p className="text-xs leading-relaxed text-muted-foreground">
            {description}
        </p>
    </div>
);

export {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
    TooltipProvider,
    TooltipCard,
};
