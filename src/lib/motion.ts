import type { Variants, Transition } from "framer-motion";

/**
 * Blogino's shared motion system.
 *
 * One place for easings, durations and the entrance patterns used across
 * the site, so public pages, dashboards and dialogs all move the same way.
 * Keep animations purposeful: entrances are quick fades with a small rise,
 * staggers are short, and nothing loops on screen except ambient decor.
 */

/** Signature easing — fast start, long settle. */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/** Slightly softer ease for larger surfaces. */
export const EASE_SOFT = [0.33, 1, 0.68, 1] as const;

export const DURATION = {
    fast: 0.25,
    base: 0.4,
    slow: 0.6,
} as const;

const spring: Transition = {
    type: "spring",
    stiffness: 260,
    damping: 30,
    mass: 0.9,
};

/** Simple fade with a small upward settle. */
export const fadeUp: Variants = {
    hidden: { opacity: 0, y: 16 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: DURATION.base, ease: EASE_OUT },
    },
};

/** Fade only — for text that shouldn't shift layout. */
export const fadeIn: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: DURATION.base, ease: EASE_OUT } },
};

/** Slight scale settle for images and covers. */
export const scaleIn: Variants = {
    hidden: { opacity: 0, scale: 0.97 },
    show: {
        opacity: 1,
        scale: 1,
        transition: { duration: DURATION.slow, ease: EASE_OUT },
    },
};

/** Parent that staggers its `staggerItem` children. */
export function staggerContainer(stagger = 0.06, delay = 0): Variants {
    return {
        hidden: {},
        show: { transition: { staggerChildren: stagger, delayChildren: delay } },
    };
}

/** Child of `staggerContainer` — inherits the parent's orchestration. */
export const staggerItem: Variants = {
    hidden: { opacity: 0, y: 14 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: DURATION.base, ease: EASE_OUT },
    },
};

/** While-in-view variant pair for scroll-triggered sections. */
export const revealOnScroll: Variants = {
    hidden: { opacity: 0, y: 24 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: DURATION.slow, ease: EASE_OUT },
    },
};

/** Interactive feedback (buttons, chips, cards) — springy but damped. */
export const pressable = {
    whileTap: { scale: 0.97 },
    transition: spring,
} as const;

/** Dropdown / popover entrance. */
export const popoverMotion = {
    initial: { opacity: 0, y: -6, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -6, scale: 0.98 },
    transition: { duration: DURATION.fast, ease: EASE_OUT },
} as const;
