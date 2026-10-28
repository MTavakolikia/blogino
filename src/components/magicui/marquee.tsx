"use client";

import { cn } from "@/lib/utils";
import React, { useState } from "react";

interface MarqueeProps
    extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * Optional CSS classnames that are applied to the track
     *
     * @example
     * ```tsx
     * <Marquee
     *   className="[--duration:20s]"
     * />
     * ```
     */
    className?: string;
    /**
     * Whether to reverse the direction of the marquee.
     *
     * @default false
     */
    reverse?: boolean;
    /**
     * The gap between each marquee item.
     *
     * @default "gap-4"
     */
    gap?: string;
}

/**
 * An infinitely looping, horizontal scrolling row of items.
 * Pause on hover is supported via `pauseOnHover`.
 */
export default function Marquee({
    reverse = false,
    repeat = 4,
    pauseOnHover = false,
    children,
    className,
    ...props
}: {
    reverse?: boolean;
    repeat?: number;
    pauseOnHover?: boolean;
    children: React.ReactNode;
} & MarqueeProps) {
    const [paused, setPaused] = useState(false);

    return (
        <div
            {...props}
            className={cn(
                "group flex overflow-hidden p-2 [--duration:40s] [--gap:1rem] [gap:var(--gap)]",
                {
                    "[&>div]:animation-play-state:paused":
                        paused && pauseOnHover,
                },
                className,
            )}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            {Array(repeat)
                .fill(0)
                .map((_, i) => (
                    <div
                        key={i}
                        className={cn(
                            "flex shrink-0 justify-around [gap:var(--gap)]",
                            "animate-marquee motion-reduce:animate-none",
                            "min-w-full grow-[1]",
                            reverse && "[animation-direction:reverse]",
                        )}
                    >
                        {children}
                    </div>
                ))}
        </div>
    );
}
