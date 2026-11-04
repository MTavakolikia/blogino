"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * A soft radial spotlight that follows the mouse inside its container.
 * Wrap any section — the glow renders behind `children` and fades out
 * when the cursor leaves.
 */
export function Spotlight({
    className,
    children,
    radius = 620,
    intensity = 0.09,
}: {
    className?: string;
    children: React.ReactNode;
    radius?: number;
    intensity?: number;
}) {
    const ref = React.useRef<HTMLDivElement>(null);
    const [position, setPosition] = React.useState({ x: 0, y: 0 });
    const [visible, setVisible] = React.useState(false);

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        setVisible(true);
        setPosition({
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        });
    };

    return (
        <div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setVisible(false)}
            className={cn("relative overflow-hidden", className)}
        >
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 transition-opacity duration-700"
                style={{
                    opacity: visible ? 1 : 0,
                    background: `radial-gradient(${radius}px circle at ${position.x}px ${position.y}px, hsl(var(--primary) / ${intensity}), transparent 70%)`,
                }}
            />
            <div className="relative">{children}</div>
        </div>
    );
}
