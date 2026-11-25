"use client";

import { useState } from "react";
import Image from "next/image";
import { Newspaper } from "lucide-react";

import { cn } from "@/lib/utils";

const GRADIENTS = [
    "from-sky-500/25 via-muted to-indigo-500/20",
    "from-teal-500/25 via-muted to-cyan-500/20",
    "from-violet-500/25 via-muted to-fuchsia-500/20",
    "from-amber-500/25 via-muted to-orange-500/20",
    "from-emerald-500/25 via-muted to-lime-500/20",
    "from-rose-500/25 via-muted to-pink-500/20",
];

function pickGradient(seed: string) {
    let hash = 0;
    for (let i = 0; i < seed.length; i += 1) {
        hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
    }
    return GRADIENTS[hash % GRADIENTS.length];
}

/**
 * Cover image with a graceful, on-brand fallback when the remote image is
 * missing or fails to load (common with third-party image hosts).
 */
export default function PostCover({
    src,
    alt = "",
    label,
    sizes,
    priority,
    className,
    iconClassName,
}: {
    src?: string | null;
    alt?: string;
    label?: string | null;
    sizes?: string;
    priority?: boolean;
    className?: string;
    iconClassName?: string;
}) {
    const [failed, setFailed] = useState(false);

    if (!src || failed) {
        return (
            <div
                aria-hidden="true"
                className={cn(
                    "relative flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br",
                    pickGradient(alt || src || "blogino"),
                )}
            >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.18),transparent_55%)]" />
                <Newspaper
                    className={cn(
                        "relative h-9 w-9 text-primary/45",
                        iconClassName,
                    )}
                    strokeWidth={1.5}
                />
                {label && (
                    <span className="relative px-4 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/80">
                        {label}
                    </span>
                )}
            </div>
        );
    }

    return (
        <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            onError={() => setFailed(true)}
            className={className}
        />
    );
}
