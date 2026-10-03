"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import {
    ArrowUpRight,
    CalendarClock,
    CheckCircle2,
    Heart,
    MessageSquare,
    Newspaper,
    PenLine,
    Tag,
} from "lucide-react";

import { NumberTicker } from "@/components/magicui/number-ticker";
import { BorderBeam } from "@/components/magicui/border-beam";
import { Button } from "@/components/ui/button";

type DashboardStatsProps = {
    greeting: string;
    role: string;
    stats: {
        activePosts: number;
        inactivePosts: number;
        categories: number;
        likes: number;
        comments: number;
    };
};

const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
};

const item: Variants = {
    hidden: { opacity: 0, y: 16 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
    },
};

export default function DashboardStats({ greeting, role, stats }: DashboardStatsProps) {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                        Dashboard
                    </p>
                    <h1 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">
                        Welcome back, {greeting.split(" ")[0]}
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {role === "ADMIN" ? "You have full editorial control over Blogino." : "Here's what's happening with your writing."}
                    </p>
                </div>
                <Button asChild size="sm">
                    <Link href="/dashboard/posts/create">
                        <PenLine className="h-4 w-4" /> Write a new post
                    </Link>
                </Button>
            </div>

            {/* Stat cards */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
            >
                <StatCard
                    icon={CheckCircle2}
                    label="Published posts"
                    value={stats.activePosts}
                    accent="text-primary"
                    beam
                />
                <StatCard
                    icon={CalendarClock}
                    label="Drafts in progress"
                    value={stats.inactivePosts}
                    accent="text-chart-4"
                />
                <StatCard
                    icon={Heart}
                    label="Likes you received"
                    value={stats.likes}
                    accent="text-chart-3"
                />
                <StatCard
                    icon={MessageSquare}
                    label="Comments you made"
                    value={stats.comments}
                    accent="text-chart-2"
                />
            </motion.div>

            {/* Quick links */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-2 gap-4 sm:grid-cols-4"
            >
                <QuickLink
                    href="/dashboard/posts"
                    icon={Newspaper}
                    label="Manage posts"
                />
                <QuickLink
                    href="/dashboard/manage-categories"
                    icon={Tag}
                    label="Categories"
                    hint={`${stats.categories} total`}
                />
                <QuickLink
                    href="/dashboard/saved-post"
                    icon={CalendarClock}
                    label="Saved posts"
                />
                <QuickLink
                    href="/dashboard/liked-post"
                    icon={Heart}
                    label="Liked posts"
                />
            </motion.div>
        </div>
    );
}

function StatCard({
    icon: Icon,
    label,
    value,
    accent,
    beam = false,
}: {
    icon: React.ElementType;
    label: string;
    value: number;
    accent: string;
    beam?: boolean;
}) {
    return (
        <motion.div
            variants={item}
            className="relative overflow-hidden rounded-2xl border border-border/70 bg-card p-5 shadow-sm"
        >
            {beam && <BorderBeam duration={10} borderWidth={1.25} />}
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">{label}</p>
                <Icon className={`h-5 w-5 ${accent}`} strokeWidth={1.75} />
            </div>
            <div className="mt-3">
                <NumberTicker
                    value={value}
                    className="text-3xl font-semibold tabular-nums tracking-tight"
                />
            </div>
        </motion.div>
    );
}

function QuickLink({
    href,
    icon: Icon,
    label,
    hint,
}: {
    href: string;
    icon: React.ElementType;
    label: string;
    hint?: string;
}) {
    return (
        <motion.div variants={item}>
            <Link
                href={href}
                className="group flex items-center justify-between rounded-xl border border-border/70 bg-card px-4 py-3 shadow-sm transition-colors hover:border-primary/40"
            >
                <span className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" strokeWidth={1.75} />
                    <span className="text-sm font-medium">{label}</span>
                </span>
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    {hint}
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
            </Link>
        </motion.div>
    );
}
