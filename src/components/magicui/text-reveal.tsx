"use client";

import { motion, useInView } from "framer-motion";
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
    // Observe the outer wrapper: the animated words are clipped inside an
    // overflow-hidden box, so observing them directly would always report 0%.
    const inView = useInView(containerRef, { once: true, margin: "0px" });

    const offset = direction === "top" ? 1 : -1;
    const initial = { y: `${offset * 110}%`, opacity: 0 };
    const visible = { y: "0%", opacity: 1 };
    const shouldAnimate =
        animate === "always" || (animate === "animate" && inView);

    return (
        <span
            ref={containerRef}
            aria-label={text}
            className={cn("inline-flex flex-wrap", className)}
        >
            <span className="sr-only">{text}</span>
            <span aria-hidden className="inline-flex flex-wrap gap-x-[0.28em]">
                {words.map((word, i) => (
                    <span
                        key={`${word}-${i}`}
                        className="inline-block overflow-hidden pb-[0.12em] align-bottom"
                    >
                        <motion.span
                            className="inline-block"
                            initial={initial}
                            animate={shouldAnimate ? visible : initial}
                            transition={{
                                delay: delay + i * stagger,
                                duration: 0.6,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                        >
                            {word}
                        </motion.span>
                    </span>
                ))}
            </span>
        </span>
    );
};

export { TextReveal };
