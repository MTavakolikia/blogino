"use client";

import { useEffect } from "react";

/**
 * Fires a single view-tracking POST when a post is opened. The API dedupes
 * per-browser via cookie, so re-reading the same article never double
 * counts.
 */
export default function ViewTracker({ postId }: { postId: string }) {
    useEffect(() => {
        let cancelled = false;

        const record = async () => {
            try {
                await fetch(`/api/posts/${encodeURIComponent(postId)}/view`, {
                    method: "POST",
                });
            } catch {
                // view tracking must never break the page
            }
        };

        if (!cancelled) void record();

        return () => {
            cancelled = true;
        };
    }, [postId]);

    return null;
}
