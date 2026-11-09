"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * Cycles through a list of words with a vertical slide transition.
 * Rendered as an inline element with a fixed line height so the layout
 * never jumps while words rotate.
 */
const WordRotate = ({
    words,
    interval = 2600,
    className,
}: {
    words: string[];
    interval?: number;
    className?: string;
}) => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (words.length <= 1) return;
        const id = setInterval(
            () => setIndex((i) => (i + 1) % words.length),
            interval,
        );
        return () => clearInterval(id);
    }, [words.length, interval]);

    const current = words[index % Math.max(words.length, 1)] ?? "";

    return (
        <span
            aria-label={current}
            className={cn(
                "relative inline-flex h-[1.25em] items-baseline overflow-hidden align-baseline",
                className,
            )}
        >
            <span className="sr-only">{current}</span>
            <span aria-hidden className="relative inline-flex h-full items-baseline">
                <AnimatePresence mode="wait">
                    <motion.span
                        key={current}
                        initial={{ y: "110%", opacity: 0 }}
                        animate={{ y: "0%", opacity: 1 }}
                        exit={{ y: "-110%", opacity: 0 }}
                        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                        className="inline-block whitespace-nowrap bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent"
                    >
                        {current}
                    </motion.span>
                </AnimatePresence>
            </span>
        </span>
    );
};

export { WordRotate };
