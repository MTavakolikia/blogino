"use client";

import { cn } from "@/lib/utils";
import { motion, type HTMLMotionProps } from "framer-motion";
import React from "react";

interface ShimmerButtonProps
    extends Omit<HTMLMotionProps<"button">, "children"> {
    shimmerColor?: string;
    shimmerSize?: string;
    shimmerDelay?: number;
    shimmerDuration?: number;
    borderRadius?: string;
    borderWidth?: string;
    glowColor?: string;
    children?: React.ReactNode;
}

const ShimmerButton = React.forwardRef<HTMLButtonElement, ShimmerButtonProps>(
    (
        {
            shimmerColor = "#ffffff",
            shimmerSize = "0.5em",
            shimmerDelay = 0,
            shimmerDuration = 1.5,
            borderRadius = "9999px",
            borderWidth = "4px",
            glowColor = "#ffffff",
            className,
            children,
            ...props
        },
        ref,
    ) => {
        return (
            <motion.button
                ref={ref}
                style={
                    {
                        "--shimmer-color": shimmerColor,
                        "--shimmer-size": shimmerSize,
                        "--shimmer-delay": `${shimmerDelay}s`,
                        "--shimmer-duration": `${shimmerDuration}s`,
                        "--border-radius": borderRadius,
                        "--border-width": borderWidth,
                        "--glow-color": glowColor,
                    } as React.CSSProperties
                }
                className={cn(
                    "group relative w-auto cursor-pointer overflow-hidden whitespace-nowrap px-6 py-2 text-white [background:linear-gradient(var(--background-color),var(--background-color))_padding-box,linear-gradient(to_right,var(--color-1),var(--color-2),var(--color-3),var(--color-4))_border-box]",
                    "transition-colors duration-300 ease-in-out [border:0px_solid_transparent] hover:[--color-1:var(--shimmer-color)] hover:[--color-4:var(--shimmer-color)]",
                    className,
                )}
                {...props}
            >
                <span
                    className="relative block h-full w-full text-sm font-medium shadow-[inset_0_-px_10px_-10px_var(--shadow-color)]"
                    style={
                        {
                            "--background-color": "oklch(24.7% 0.015 263.238)",
                            "--color-1": "oklch(41.8% 0.015 263.083)",
                            "--color-2": "oklch(27.8% 0.006 249.558)",
                            "--color-3": "oklch(27.8% 0.006 249.558)",
                            "--color-4": "oklch(41.8% 0.015 263.083)",
                            "--shadow-color": "oklch(0% 0% 0% / 0.2)",
                            borderRadius: "var(--border-radius)",
                        } as React.CSSProperties
                    }
                >
                    {children}
                </span>
                <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 overflow-hidden"
                    style={{ borderRadius: "var(--border-radius)" }}
                >
                    <span
                        className="absolute -inset-full w-full"
                        style={
                            {
                                "--shimmer-x": "-200%",
                                "--shimmer-y": 0,
                                "--shimmer-z": "calc(100% + var(--shimmer-size))",
                                background:
                                    "radial-gradient(16px 16px at var(--shimmer-x) var(--shimmer-y), var(--shimmer-color), transparent)",
                                animation:
                                    "shimmer var(--shimmer-duration) infinite linear",
                                animationDelay: "var(--shimmer-delay)",
                            } as React.CSSProperties
                        }
                    />
                </span>
            </motion.button>
        );
    },
);

ShimmerButton.displayName = "ShimmerButton";

export { ShimmerButton };
