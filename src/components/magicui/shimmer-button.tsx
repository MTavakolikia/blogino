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
            shimmerColor = "rgba(255,255,255,0.85)",
            shimmerSize = "0.6em",
            shimmerDelay = 0,
            shimmerDuration = 1.8,
            borderRadius = "9999px",
            borderWidth = "1px",
            glowColor = "rgba(4,133,159,0.35)",
            className,
            children,
            style,
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
                        "--shimmer-z": "0px",
                        "--background-color": "oklch(24.7% 0.015 263.238)",
                        "--color-1": "oklch(58% 0.11 210)",
                        "--color-2": "oklch(48% 0.09 250)",
                        "--color-3": "oklch(42% 0.07 280)",
                        "--color-4": "oklch(58% 0.11 210)",
                        borderRadius,
                        // Two backgrounds: the solid fill clipped to the padding
                        // box, and the gradient clipped to the border box. This
                        // renders a crisp gradient ring without a wrapper.
                        background:
                            "linear-gradient(var(--background-color), var(--background-color)) padding-box, " +
                            "linear-gradient(120deg, var(--color-1), var(--color-2), var(--color-3), var(--color-4)) border-box",
                        border: "var(--border-width) solid transparent",
                        ...style,
                    } as React.CSSProperties
                }
                className={cn(
                    "group relative w-auto cursor-pointer overflow-hidden whitespace-nowrap px-6 py-2.5 text-white",
                    "shadow-lg shadow-black/20 transition-[transform,box-shadow,filter] duration-300 ease-out",
                    "hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[0_18px_40px_-12px_var(--glow-color)] hover:brightness-110",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    className,
                )}
                {...props}
            >
                <span className="relative z-10 block h-full w-full text-sm font-semibold">
                    {children}
                </span>

                {/* Traveling light sweep. */}
                <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
                    style={{ borderRadius: "var(--border-radius)" }}
                >
                    <span
                        className="absolute -inset-full h-[200%] w-[200%] opacity-70 motion-reduce:hidden"
                        style={
                            {
                                background:
                                    "radial-gradient(18px 18px at 0% 50%, var(--shimmer-color), transparent)",
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
