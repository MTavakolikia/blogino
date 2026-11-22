"use client";

import { ShimmerButton } from "@/components/magicui/shimmer-button";

export default function StartReadingButton() {
    const scrollToLatest = () => {
        document
            .getElementById("latest")
            ?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <ShimmerButton shimmerDuration={2.5} onClick={scrollToLatest}>
            <span className="text-sm font-semibold">Start reading</span>
        </ShimmerButton>
    );
}
