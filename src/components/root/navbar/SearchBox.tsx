"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { CornerDownLeft, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface PostResult {
    id: string;
    title: string;
    category: { name: string } | null;
}

export default function SearchBox({
    onNavigate,
    className,
}: {
    onNavigate?: () => void;
    className?: string;
}) {
    const router = useRouter();
    const [posts, setPosts] = useState<PostResult[]>([]);
    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const rootRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        (async () => {
            try {
                const postRes = await axios.get("/api/posts", {
                    params: { limit: 100 },
                });
                setPosts(
                    postRes.data.posts.map((p: PostResult) => ({
                        id: p.id,
                        title: p.title,
                        category: p.category,
                    })),
                );
            } catch {
                /* ignore */
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    // Close the dropdown when clicking anywhere outside the search box.
    useEffect(() => {
        function onPointerDown(e: MouseEvent) {
            if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", onPointerDown);
        return () => document.removeEventListener("mousedown", onPointerDown);
    }, []);

    const results = useMemo(() => {
        const q = query.trim().toLowerCase();
        return posts
            .filter((p) => (q ? p.title.toLowerCase().includes(q) : true))
            .slice(0, 6);
    }, [posts, query]);

    const goTo = (path: string) => {
        setOpen(false);
        setQuery("");
        inputRef.current?.blur();
        onNavigate?.();
        router.push(path);
    };

    return (
        <div ref={rootRef} className={cn("relative w-full md:w-64", className)}>
            <div className="relative">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setOpen(true);
                    }}
                    onFocus={() => setOpen(true)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && results[0]) {
                            goTo(`/post/${results[0].id}`);
                        } else if (e.key === "Escape") {
                            setOpen(false);
                            inputRef.current?.blur();
                        }
                    }}
                    placeholder="Search articles..."
                    className="h-9 pl-8 text-sm pr-8"
                    aria-label="Search articles"
                />
                {query && (
                    <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:block">
                        ⏎
                    </kbd>
                )}
            </div>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-border bg-popover shadow-lg md:left-auto md:w-80"
                    >
                        {loading ? (
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
                        ) : results.length === 0 ? (
                            <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                                No articles found
                            </div>
                        ) : (
                            <ul className="max-h-80 overflow-y-auto p-1">
                                {results.map((p, i) => (
                                    <li key={p.id}>
                                        <button
                                            type="button"
                                            onClick={() => goTo(`/post/${p.id}`)}
                                            className="flex w-full items-start justify-between gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-muted"
                                        >
                                            <span className="min-w-0">
                                                <span className="line-clamp-2 block text-sm font-medium text-foreground">
                                                    {p.title}
                                                </span>
                                                {p.category && (
                                                    <span className="mt-0.5 block text-xs text-muted-foreground">
                                                        {p.category.name}
                                                    </span>
                                                )}
                                            </span>
                                            {i === 0 && query.trim() && (
                                                <CornerDownLeft className="mt-1 h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
                                            )}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
