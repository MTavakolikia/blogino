"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    BookmarkCheck,
    Home,
    Newspaper,
    PenLine,
    User,
} from "lucide-react";

import { cn } from "@/lib/utils";

const ITEMS = [
    { href: "/", label: "Home", icon: Home, exact: true },
    { href: "/post", label: "Articles", icon: Newspaper, exact: false },
    { href: "/dashboard/saved-post", label: "Saved", icon: BookmarkCheck, exact: false },
    { href: "/dashboard/profile", label: "Account", icon: User, exact: false },
];

function BottomNav() {
    const pathname = usePathname();

    const isActive = (item: (typeof ITEMS)[number]) =>
        item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

    return (
        <nav
            className="fixed inset-x-0 bottom-0 z-50 border-t border-border/70 bg-background/85 backdrop-blur-md md:hidden"
            style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
            <div className="mx-auto grid h-16 max-w-md grid-cols-4 items-center px-2">
                {ITEMS.slice(0, 2).map((item) => (
                    <NavItem key={item.href} item={item} active={isActive(item)} />
                ))}

                {/* Center: create post */}
                <div className="relative flex items-center justify-center">
                    <Link
                        href="/dashboard/posts/create"
                        className="absolute -top-5 flex h-[52px] w-[52px] items-center justify-center rounded-2xl bg-primary p-3.5 text-primary-foreground shadow-lg shadow-primary/30 transition-transform active:scale-95"
                        aria-label="Create post"
                    >
                        <PenLine className="h-5 w-5" />
                    </Link>
                </div>

                {ITEMS.slice(2).map((item) => (
                    <NavItem key={item.href} item={item} active={isActive(item)} />
                ))}
            </div>
        </nav>
    );
}

function NavItem({
    item,
    active,
}: {
    item: (typeof ITEMS)[number];
    active: boolean;
}) {
    const Icon = item.icon;
    return (
        <Link
            href={item.href}
            className={cn(
                "flex flex-col items-center justify-center gap-0.5 rounded-xl py-1 text-[11px] font-medium transition-colors",
                active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground",
            )}
        >
            <Icon className={cn("h-5 w-5", active && "scale-110")} />
            {item.label}
        </Link>
    );
}

export default BottomNav;
