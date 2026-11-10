"use client";

import { motion, type Variants } from "framer-motion";
import { useRef } from "react";

import { cn } from "@/lib/utils";

type Direction = "top" | "bottom";

const TextReveal = ({
    text,
    className,
    delay = 0,
    stagger = 0.04,
    animate = "animate",
    direction = "bottom",
}: {
    text: string;
    className?: string;
    delay?: number;
    stagger?: number;
    animate?: "animate" | "once" | "always";
    direction?: Direction;
}) => {
    const words = text.split(" ");
    const containerRef = useRef<HTMLSpanElement>(null);

    const offset = direction === "top" ? 1 : -1;

    const variants: Variants = {
        hidden: {},
        animate: (i: number) => ({
            y: 0,
            opacity: 1,
            transition: {
                delay: delay + i * stagger,
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
            },
        }),
    };

    return (
        <span
            ref={containerRef}
            aria-label={text}
            className={cn("inline-flex flex-wrap", className)}
        >
            <span className="sr-only">{text}</span>
            <span aria-hidden className="inline-flex flex-wrap gap-x-[0.28em]">
                {words.map((word, i) => (
                    <motion.span
                        key={`${word}-${i}`}
                        className="inline-block overflow-hidden pb-[0.12em] align-bottom"
                    >
                        <motion.span
                            className="inline-block will-change-transform"
                            initial={{ y: `${offset * 110}%`, opacity: 0 }}
                            animate={
                                animate === "always" ? "animate" : undefined
                            }
                            whileInView={
                                animate === "animate" ? "animate" : undefined
                            }
                            viewport={{ once: true, margin: "0px" }}
                            variants={variants}
                            custom={i}
                        >
                            {word}
                        </motion.span>
                    </motion.span>
                ))}
            </span>
        </span>
    );
};

export { TextReveal };
