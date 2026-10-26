"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

import { cn } from "@/lib/utils";

interface BorderBeamProps {
    className?: string;
    /** Seconds for one full rotation. */
    duration?: number;
    /** Seconds before the animation starts. */
    delay?: number;
    /** Border thickness in px. */
    borderWidth?: number;
    /** Colors of the light beam. */
    colors?: [string, string];
}

/**
 * A glowing light beam that continuously travels around the border of its
 * parent element (which must be `relative` with a rounded corner radius).
 */
export function BorderBeam({
    className,
    duration = 10,
    delay = 0,
    borderWidth = 1.5,
    colors = ["rgba(34, 211, 238, 0.95)", "rgba(129, 140, 248, 0.95)"],
}: BorderBeamProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: false, margin: "-120px" });

    return (
        <div
            ref={ref}
            aria-hidden
            className={cn(
                "pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]",
                "[mask-composite:exclude] [mask-image:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)]",
                className,
            )}
            style={{
                padding: borderWidth,
            }}
        >
            <motion.div
                className="absolute left-1/2 top-1/2 h-[300%] w-[300%] -translate-x-1/2 -translate-y-1/2"
                style={{
                    background: `conic-gradient(from 0deg, transparent 0deg, transparent 260deg, ${colors[0]} 310deg, ${colors[1]} 335deg, transparent 360deg)`,
                }}
                initial={{ rotate: 0 }}
                animate={isInView ? { rotate: 360 } : {}}
                transition={{
                    duration,
                    ease: "linear",
                    repeat: Infinity,
                    delay,
                }}
            />
        </div>
    );
}
