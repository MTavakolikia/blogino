"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Loader2, Search, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { postPath } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { popoverMotion } from "@/lib/motion";

interface PostResult {
    id: string;
    title: string;
    slug?: string | null;
    category: { name: string } | null;
}

const DEBOUNCE_MS = 280;

export default function SearchBox({
    onNavigate,
    className,
    autoFocus,
}: {
    onNavigate?: () => void;
    className?: string;
    autoFocus?: boolean;
}) {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<PostResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [active, setActive] = useState(-1);
    const rootRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Debounced backend search: title + excerpt, published posts only.
    useEffect(() => {
        const q = query.trim();
        if (!q) {
            setResults([]);
            setLoading(false);
            return;
        }
        setLoading(true);
        const controller = new AbortController();
        const timer = setTimeout(async () => {
            try {
                const res = await fetch(
                    `/api/posts?q=${encodeURIComponent(q)}&limit=6`,
                    { signal: controller.signal },
                );
                const data = await res.json();
                setResults(data.posts ?? []);
            } catch {
                /* aborted or failed — keep previous results */
            } finally {
                setLoading(false);
            }
        }, DEBOUNCE_MS);

        return () => {
            clearTimeout(timer);
            controller.abort();
        };
    }, [query]);

    // Close when clicking anywhere outside.
    useEffect(() => {
        function onPointerDown(e: MouseEvent) {
            if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", onPointerDown);
        return () => document.removeEventListener("mousedown", onPointerDown);
    }, []);

    useEffect(() => {
        if (autoFocus) inputRef.current?.focus();
    }, [autoFocus]);

    const goTo = useCallback(
        (path: string) => {
            setOpen(false);
            setQuery("");
            setActive(-1);
            inputRef.current?.blur();
            onNavigate?.();
            router.push(path);
        },
        [onNavigate, router],
    );

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Escape") {
            setOpen(false);
            inputRef.current?.blur();
            return;
        }
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            if (results.length === 0) return;
            setActive((prev) => {
                const delta = e.key === "ArrowDown" ? 1 : -1;
                return (prev + delta + results.length) % results.length;
            });
            return;
        }
        if (e.key === "Enter") {
            const q = query.trim();
            if (active >= 0 && results[active]) {
                goTo(postPath(results[active]));
            } else if (q) {
                goTo(`/post?q=${encodeURIComponent(q)}`);
            }
        }
    };

    const searching = query.trim().length > 0;

    return (
        <div ref={rootRef} className={cn("relative w-full md:w-72", className)}>
            <div className="relative">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setOpen(true);
                        setActive(-1);
                    }}
                    onFocus={() => setOpen(true)}
                    onKeyDown={onKeyDown}
                    placeholder="Search articles…"
                    className="h-9 rounded-full pl-8 pr-8 text-sm"
                    aria-label="Search articles"
                    role="combobox"
                    aria-expanded={open}
                    aria-controls="search-suggestions"
                    aria-activedescendant={
                        active >= 0 ? `search-option-${active}` : undefined
                    }
                />
                {searching && (
                    <button
                        type="button"
                        onClick={() => {
                            setQuery("");
                            inputRef.current?.focus();
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground transition-colors hover:text-foreground"
                        aria-label="Clear search"
                    >
                        <X className="h-3.5 w-3.5" />
                    </button>
                )}
            </div>

            <AnimatePresence>
                {open && searching && (
                    <motion.div
                        {...popoverMotion}
                        id="search-suggestions"
                        role="listbox"
                        className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-border bg-popover shadow-lg md:left-auto md:w-96"
                    >
                        {loading && results.length === 0 ? (
                            <div className="space-y-1 p-2" aria-hidden="true">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-3 rounded-lg px-2 py-2.5"
                                    >
                                        <Skeleton className="h-8 w-10 shrink-0 rounded-md" />
                                        <div className="flex-1 space-y-1.5">
                                            <Skeleton className="h-3.5 w-3/4" />
                                            <Skeleton className="h-3 w-20" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : !loading && results.length === 0 ? (
                            <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                                No articles match “{query.trim()}”
                            </div>
                        ) : (
                            <>
                                <ul className="max-h-80 overflow-y-auto p-1">
                                    {results.map((p, i) => (
                                        <li
                                            key={p.id}
                                            id={`search-option-${i}`}
                                            role="option"
                                            aria-selected={i === active}
                                        >
                                            <button
                                                type="button"
                                                onMouseEnter={() => setActive(i)}
                                                onClick={() => goTo(postPath(p))}
                                                className={cn(
                                                    "flex w-full flex-col gap-0.5 rounded-lg px-3 py-2 text-left transition-colors",
                                                    i === active && "bg-muted",
                                                )}
                                            >
                                                <span className="line-clamp-2 text-sm font-medium text-foreground">
                                                    {p.title}
                                                </span>
                                                {p.category && (
                                                    <span className="text-xs text-muted-foreground">
                                                        {p.category.name}
                                                    </span>
                                                )}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    type="button"
                                    onClick={() =>
                                        goTo(
                                            `/post?q=${encodeURIComponent(query.trim())}`,
                                        )
                                    }
                                    className="flex w-full items-center justify-between border-t border-border/70 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-muted/60"
                                >
                                    See all results for “{query.trim()}”
                                    <ArrowRight className="h-3.5 w-3.5" />
                                </button>
                            </>
                        )}
                        {loading && results.length > 0 && (
                            <Loader2
                                className="absolute right-3 top-3 h-3.5 w-3.5 animate-spin text-muted-foreground"
                                aria-hidden
                            />
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
