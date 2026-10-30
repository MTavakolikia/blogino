"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionValue, useSpring } from "framer-motion";

function NumberTicker({
    value,
    startValue = 0,
    duration = 1.2,
    locale = "en-US",
    className,
}: {
    value: number;
    startValue?: number;
    duration?: number;
    /** Fixed locale so the server and client render identical digits. */
    locale?: string;
    className?: string;
}) {
    const motionValue = useMotionValue(startValue);
    const springValue = useSpring(motionValue, { duration, bounce: 0 });
    const [displayValue, setDisplayValue] = useState(startValue);
    const frameRef = useRef<number | null>(null);

    useEffect(() => {
        motionValue.set(value);

        const unsubscribe = springValue.on("change", (latest) => {
            if (frameRef.current) cancelAnimationFrame(frameRef.current);
            frameRef.current = requestAnimationFrame(() => {
                setDisplayValue(Math.round(latest));
            });
        });

        return () => {
            unsubscribe();
            if (frameRef.current) cancelAnimationFrame(frameRef.current);
        };
    }, [value, motionValue, springValue]);

    return (
        <span className={className} aria-label={value.toLocaleString(locale)}>
            {displayValue.toLocaleString(locale)}
        </span>
    );
}

export { NumberTicker };
