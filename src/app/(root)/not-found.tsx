import Link from "next/link";
import { Home, SearchX } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FlickeringGrid } from "@/components/magicui/flickering-grid";
import { TextReveal } from "@/components/magicui/text-reveal";

export default function NotFound() {
    return (
        <div className="relative flex min-h-[72vh] items-center justify-center overflow-hidden">
            <div className="pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_top,transparent_10%,black_80%)]">
                <FlickeringGrid
                    squareSize={4}
                    gridGap={6}
                    color="var(--ring)"
                    maxOpacity={0.12}
                    flickerChance={0.04}
                />
            </div>

            <div className="relative px-4 py-20 text-center">
                <p className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
                    Error 404
                </p>

                <h1 className="mt-6 text-4xl font-semibold tracking-tighter md:text-6xl">
                    <TextReveal text="This page doesn't exist" />
                </h1>

                <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
                    The page you're looking for was unpublished, moved, or
                    never written at all. Let's get you back to somewhere
                    useful.
                </p>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                    <Button asChild size="lg">
                        <Link href="/">
                            <Home className="h-4 w-4" /> Back home
                        </Link>
                    </Button>
                    <Button asChild size="lg" variant="outline">
                        <Link href="/post">
                            <SearchX className="h-4 w-4" /> Browse articles
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
