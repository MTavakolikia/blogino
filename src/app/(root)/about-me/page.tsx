import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, PenLine, Sparkles } from "lucide-react";

import {
    Tooltip,
    TooltipCard,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/magicui/animated-tooltip";
import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
import { BorderBeam } from "@/components/magicui/border-beam";
import { FlickeringGrid } from "@/components/magicui/flickering-grid";
import Marquee from "@/components/magicui/marquee";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { TextReveal } from "@/components/magicui/text-reveal";
import { WordRotate } from "@/components/magicui/word-rotate";
import { AuthorCard } from "@/components/posts/AuthorCard";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/root/SectionHeading";
import { prisma } from "@/utils/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "About",
    description:
        "What Blogino is, how the writing gets made, and the people behind the bylines.",
};

const HERO_WORDS = [
    "read deeply",
    "write often",
    "build in public",
    "ask better questions",
];

const STACK = [
    {
        name: "Next.js",
        blurb: "App Router, server components and Turbopack keep every page fast.",
    },
    {
        name: "Prisma + Postgres",
        blurb: "Posts, authors and comments live in one boring, reliable database.",
    },
    {
        name: "Tailwind CSS",
        blurb: "One design system, light and dark, shared by every page.",
    },
    {
        name: "Framer Motion",
        blurb: "The small motions that make the site feel alive.",
    },
];

const JOURNEY = [
    {
        year: "2024",
        title: "The first post",
        text: "Blogino started as a single long article about something we wished we could find somewhere else: a guide that assumed you were smart and explained nothing you already knew.",
    },
    {
        year: "2025",
        title: "A weekly rhythm",
        text: "One promise, kept every week: a new, finished, fact-checked article. No filler to hit a quota — when we have nothing worth saying, we say so.",
    },
    {
        year: "2026",
        title: "A team of writers",
        text: "Readers became contributors. Today the bylines come from engineers, designers and product people who write the way they wish they could read.",
    },
];

function Glow({ className }: { className?: string }) {
    return (
        <div
            className={
                "absolute h-48 w-48 rounded-full bg-primary/10 blur-3xl " +
                (className ?? "")
            }
        />
    );
}

async function getStats() {
    const [posts, authors, categories, comments] = await Promise.all([
        prisma.post.count({ where: { published: true } }),
        prisma.user.count({ where: { role: "AUTHOR" } }),
        prisma.category.count(),
        prisma.comment.count(),
    ]);
    return { posts, authors, categories, comments };
}

async function getAuthors() {
    return prisma.user.findMany({
        where: { role: "AUTHOR" },
        orderBy: { createdAt: "asc" },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePic: true,
            _count: { select: { posts: { where: { published: true } } } },
        },
    });
}

async function getCategories() {
    return prisma.category.findMany({
        orderBy: { name: "asc" },
        include: {
            _count: { select: { posts: { where: { published: true } } } },
        },
    });
}

export default async function AboutPage() {
    const [stats, authors, categories] = await Promise.all([
        getStats(),
        getAuthors(),
        getCategories(),
    ]);

    return (
        <div className="relative">
            {/* Hero */}
            <div className="relative overflow-hidden border-b border-border/60">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-64 [mask-image:linear-gradient(to_top,transparent_20%,black_90%)]">
                    <FlickeringGrid
                        className="absolute left-0 top-0 size-full"
                        squareSize={4}
                        gridGap={6}
                        color="var(--ring)"
                        maxOpacity={0.16}
                        flickerChance={0.05}
                    />
                </div>

                <div className="relative mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
                    <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm">
                        <Sparkles className="h-3 w-3 text-primary" />
                        About Blogino
                    </p>

                    <h1 className="max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tighter md:text-6xl">
                        <TextReveal text="A home for people who" />{" "}
                        <WordRotate words={HERO_WORDS} />
                    </h1>

                    <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
                        Most tech writing is either too shallow to be useful or
                        too academic to finish. Blogino is the opposite — long,
                        practical, opinionated articles on technology, design
                        and how products get built, published on a weekly
                        rhythm.
                    </p>

                    <div className="mt-8 flex flex-wrap items-center gap-3">
                        <Button asChild size="lg">
                            <Link href="/post">
                                Start reading <ArrowRight className="h-4 w-4" />
                            </Link>
                        </Button>
                        <Button asChild size="lg" variant="outline">
                            <Link href="/contact-me">Say hello</Link>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Topics marquee */}
            {categories.length > 0 && (
                <div className="border-b border-border/60 bg-muted/20 py-5">
                    <Marquee pauseOnHover gap="gap-3">
                        {categories.map((category) => (
                            <Link
                                key={category.id}
                                href={`/post?category=${category.id}`}
                                className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border/70 bg-background px-4 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                            >
                                {category.name}
                                <span className="text-xs text-muted-foreground/70">
                                    {category._count.posts}
                                </span>
                            </Link>
                        ))}
                    </Marquee>
                </div>
            )}

            {/* What you'll find here */}
            <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-16">
                <SectionHeading
                    eyebrow="What to expect"
                    title="What you'll find here"
                    description="Six promises we make on every single article — and the numbers that back them up."
                />

                <BentoGrid className="mt-8">
                    <BentoCard
                        className="md:col-span-2"
                        beam
                        icon="Newspaper"
                        title="Deep dives, not listicles"
                        description="Articles long enough to actually explain the problem, with real code, real trade-offs and the parts where we changed our minds."
                        background={<Glow className="-right-16 -top-16" />}
                        header={
                            <div className="flex flex-wrap gap-x-10 gap-y-4">
                                <div>
                                    <NumberTicker
                                        value={stats.posts}
                                        className="text-2xl font-semibold tabular-nums tracking-tight"
                                    />
                                    <p className="mt-0.5 text-xs text-muted-foreground">
                                        Articles published
                                    </p>
                                </div>
                                <div>
                                    <NumberTicker
                                        value={stats.categories}
                                        className="text-2xl font-semibold tabular-nums tracking-tight"
                                    />
                                    <p className="mt-0.5 text-xs text-muted-foreground">
                                        Categories
                                    </p>
                                </div>
                                <div>
                                    <NumberTicker
                                        value={stats.comments}
                                        className="text-2xl font-semibold tabular-nums tracking-tight"
                                    />
                                    <p className="mt-0.5 text-xs text-muted-foreground">
                                        Reader comments
                                    </p>
                                </div>
                            </div>
                        }
                    />
                    <BentoCard
                        icon="CalendarClock"
                        title="A weekly rhythm"
                        description="A new finished article lands every week. No filler, no quota posts — consistency without padding."
                        background={<Glow className="-left-16 -bottom-16" />}
                    />
                    <BentoCard
                        icon="Users"
                        title="Many voices"
                        description="Engineers, designers and product people with different opinions — because one perspective is just an echo."
                        background={<Glow className="-right-16 -bottom-16" />}
                        header={
                            <p className="text-sm font-medium text-foreground/80">
                                {stats.authors} writers and counting
                            </p>
                        }
                    />
                    <BentoCard
                        icon="Code2"
                        title="Hands-on, copy-paste ready"
                        description="Every claim comes with a working example you can run, not a screenshot of someone else's terminal."
                        background={<Glow className="-left-16 -top-16" />}
                    />
                    <BentoCard
                        icon="Heart"
                        title="Written to be discussed"
                        description="Comments are a first-class citizen. Push back, correct us, extend an argument — the best posts grow in the replies."
                        background={<Glow className="-right-16 -top-16" />}
                    />
                </BentoGrid>

                {/* Stack */}
                <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
                    <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        Built with
                    </span>
                    <TooltipProvider delayDuration={100}>
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                            {STACK.map((item) => (
                                <Tooltip key={item.name}>
                                    <TooltipTrigger asChild>
                                        <span className="cursor-default text-sm font-medium text-foreground/80 underline-offset-4 hover:text-foreground hover:underline">
                                            {item.name}
                                        </span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <TooltipCard
                                            title={item.name}
                                            description={item.blurb}
                                        />
                                    </TooltipContent>
                                </Tooltip>
                            ))}
                        </div>
                    </TooltipProvider>
                </div>
            </div>

            {/* Authors */}
            <div className="border-t border-border/60 bg-muted/20">
                <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-16">
                    <SectionHeading
                        eyebrow="The people"
                        title="The people behind it"
                        description="A small team of writers who review each other's work before anything is published."
                    />

                    {authors.length > 0 ? (
                        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {authors.map((author) => (
                                <div
                                    key={author.id}
                                    className="flex items-center justify-between gap-4 rounded-2xl border border-border/70 bg-card p-5 shadow-sm"
                                >
                                    <AuthorCard
                                        name={`${author.firstName} ${author.lastName}`}
                                        position="Blogino author"
                                        profilePic={author.profilePic}
                                    />
                                    <span className="shrink-0 rounded-full border border-border/70 bg-muted/40 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                                        {author._count.posts} article
                                        {author._count.posts === 1 ? "" : "s"}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="mt-8 rounded-2xl border border-dashed border-border bg-card/50 px-6 py-12 text-center">
                            <PenLine className="mx-auto h-8 w-8 text-primary/70" />
                            <p className="mt-4 text-base font-medium">
                                The next byline could be yours.
                            </p>
                            <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
                                We publish work from readers all the time.
                                Create an account and pitch us a topic.
                            </p>
                            <Button asChild className="mt-6">
                                <Link href="/register">Create an account</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Journey */}
            <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-16">
                <SectionHeading
                    eyebrow="The story"
                    title="How Blogino got here"
                    description="Three moments that shaped what the blog is today."
                />

                <ol className="relative ml-3 mt-10 space-y-10 border-l border-border pl-8">
                    {JOURNEY.map((step) => (
                        <li key={step.year} className="relative">
                            <span className="absolute -left-[42px] top-0.5 flex h-5 w-5 items-center justify-center rounded-full border border-border bg-background">
                                <span className="h-2 w-2 rounded-full bg-primary" />
                            </span>
                            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                                {step.year}
                            </p>
                            <h3 className="mt-1 font-semibold tracking-tight">
                                {step.title}
                            </h3>
                            <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-muted-foreground">
                                {step.text}
                            </p>
                        </li>
                    ))}
                </ol>
            </div>

            {/* CTA */}
            <div className="mx-auto max-w-7xl px-4 pb-14 md:px-6 md:pb-20">
                <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-card px-6 py-14 text-center md:py-20">
                    <BorderBeam duration={12} borderWidth={1.25} />
                    <div className="relative mx-auto max-w-xl">
                        <h2 className="text-3xl font-semibold tracking-tighter md:text-4xl">
                            <TextReveal text="Ready to read something worth your time?" />
                        </h2>
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                            Pick a category, find a long read, and give us your
                            honest take when you're done.
                        </p>
                        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                            <Button asChild size="lg">
                                <Link href="/post">
                                    Browse articles <ArrowRight className="h-4 w-4" />
                                </Link>
                            </Button>
                            <Button asChild size="lg" variant="outline">
                                <Link href="/contact-me">Get in touch</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
