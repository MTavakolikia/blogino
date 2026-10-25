"use client";

import { motion, type Variants } from "framer-motion";
import * as React from "react";
import {
    BookOpenText,
    CalendarClock,
    Code2,
    Clock3,
    Heart,
    Mail,
    Newspaper,
    PenLine,
    Sparkles,
    Users,
} from "lucide-react";

import { BorderBeam } from "@/components/magicui/border-beam";
import { cn } from "@/lib/utils";

/**
 * Icon registry — icons are referenced by name because component functions
 * cannot be passed as props from server components to client components.
 */
const ICONS = {
    BookOpenText,
    CalendarClock,
    Code2,
    Clock3,
    Heart,
    Mail,
    Newspaper,
    PenLine,
    Sparkles,
    Users,
} as const;

export type BentoIconName = keyof typeof ICONS;

/**
 * A responsive grid of bento cards (1 column on mobile, 3 on md+).
 */
const BentoGrid = ({
    className,
    children,
}: {
    className?: string;
    children: React.ReactNode;
}) => (
    <div
        className={cn("grid grid-cols-1 gap-4 md:grid-cols-3", className)}
    >
        {children}
    </div>
);

interface BentoCardProps {
    title: string;
    description: string;
    /** Content rendered at the top of the card (stats, buttons, images…). */
    header?: React.ReactNode;
    /** Lucide icon name rendered above the title. */
    icon?: BentoIconName;
    /** Decorative background layer, revealed on hover. */
    background?: React.ReactNode;
    /** When true, a BorderBeam orbits the card border. */
    beam?: boolean;
    className?: string;
    id?: string;
    style?: React.CSSProperties;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
}

const cardVariants: Variants = {
    initial: { opacity: 0, y: 24 },
    animate: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    },
};

const BentoCard = React.forwardRef<HTMLDivElement, BentoCardProps>(
    (
        {
            className,
            title,
            description,
            header,
            icon,
            background,
            beam = false,
            id,
            style,
            onClick,
        },
        ref,
    ) => {
        const Icon = icon ? ICONS[icon] : null;
        return (
        <motion.div
            ref={ref}
            id={id}
            style={style}
            onClick={onClick}
            variants={cardVariants}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-40px" }}
            className={cn(
                "group/bento relative flex min-h-[176px] flex-col justify-between overflow-hidden rounded-2xl border border-border/70 bg-card p-6 shadow-sm transition-colors duration-300 hover:border-primary/30",
                className,
            )}
        >
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/bento:opacity-100">
                {background}
            </div>
            {beam && <BorderBeam duration={8} borderWidth={1.25} />}
            {header && <div className="relative">{header}</div>}
            <div className="relative mt-8 flex flex-col gap-1.5">
                {Icon ? (
                    <Icon className="h-5 w-5 text-primary" strokeWidth={1.75} />
                ) : null}
                <h3 className="text-base font-semibold tracking-tight text-foreground">
                    {title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                    {description}
                </p>
            </div>
        </motion.div>
        );
    },
);
BentoCard.displayName = "BentoCard";

export { BentoGrid, BentoCard };
