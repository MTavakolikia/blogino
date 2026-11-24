"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function RootError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // The full error is still logged by Next.js on the server.
        console.error(error);
    }, [error]);

    return (
        <div className="mx-auto max-w-2xl px-4 py-20">
            <div
                role="alert"
                className="rounded-2xl border border-destructive/30 bg-destructive/5 p-8"
            >
                <div className="flex items-start gap-3">
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" aria-hidden />
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight">
                            Something went wrong
                        </h1>
                        <p className="mt-2 text-sm text-muted-foreground">
                            We couldn&apos;t load this page. This usually means the
                            database is unavailable — run{" "}
                            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                                npm run db
                            </code>{" "}
                            locally, then try again.
                        </p>
                        <button
                            onClick={reset}
                            className="mt-6 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                        >
                            Try again
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
