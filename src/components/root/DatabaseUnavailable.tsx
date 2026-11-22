import { Database } from "lucide-react";

export default function DatabaseUnavailable({ compact = false }: { compact?: boolean }) {
    return (
        <div
            role="alert"
            data-testid="database-unavailable"
            className={`rounded-2xl border border-amber-500/30 bg-amber-500/5 ${compact ? "p-5" : "p-8"}`}
        >
            <div className="flex items-start gap-3">
                <Database className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" aria-hidden />
                <div>
                    <h3 className="text-sm font-semibold text-foreground">
                        Articles are temporarily unavailable
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        The database could not be reached. If you are running this
                        locally, start it with{" "}
                        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                            npm run db
                        </code>{" "}
                        and refresh the page.
                    </p>
                </div>
            </div>
        </div>
    );
}
