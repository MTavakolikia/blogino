"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Newspaper, Rss } from "lucide-react";

import { ThemeToggler } from "./ThemeToggler";
import { UserDropDownButton } from "./UserDropDownButton";
import SearchBox from "./SearchBox";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
    { href: "/", label: "Home" },
    { href: "/post", label: "Articles" },
    { href: "/about-me", label: "About" },
    { href: "/contact-me", label: "Contact" },
];

function Navbar() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    // Close the mobile menu on navigation
    useEffect(() => {
        setOpen(false);
    }, [pathname]);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
            <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-3 px-4 md:h-16 md:px-6">
                {/* Logo */}
                <Link
                    href="/"
                    className="group flex shrink-0 items-center gap-2"
                >
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                        <Rss className="h-5 w-5" />
                    </span>
                    <span className="hidden text-lg font-semibold tracking-tighter sm:block">
                        Blogino
                    </span>
                </Link>

                {/* Desktop nav */}
                <nav className="hidden items-center gap-1 md:flex">
                    {NAV_LINKS.map((link) => {
                        const active =
                            link.href === "/"
                                ? pathname === "/"
                                : pathname.startsWith(link.href);
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                                    active
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                                )}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="flex items-center gap-2">
                    <div className="hidden lg:block">
                        <SearchBox />
                    </div>
                    <ThemeToggler />
                    <UserDropDownButton />
                    {/* Mobile menu trigger */}
                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                className="md:hidden"
                                aria-label="Open menu"
                            >
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-72 p-0">
                            <SheetHeader className="border-b border-border/60 px-5 py-4 text-left">
                                <SheetTitle className="flex items-center gap-2 text-base">
                                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                        <Newspaper className="h-4 w-4" />
                                    </span>
                                    Blogino
                                </SheetTitle>
                            </SheetHeader>
                            <div className="space-y-4 p-5">
                                <SearchBox onNavigate={() => setOpen(false)} />
                                <nav className="flex flex-col">
                                    {NAV_LINKS.map((link) => {
                                        const active =
                                            link.href === "/"
                                                ? pathname === "/"
                                                : pathname.startsWith(
                                                      link.href,
                                                  );
                                        return (
                                            <Link
                                                key={link.href}
                                                href={link.href}
                                                onClick={() => setOpen(false)}
                                                className={cn(
                                                    "rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                                                    active
                                                        ? "bg-primary/10 text-primary"
                                                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                                                )}
                                            >
                                                {link.label}
                                            </Link>
                                        );
                                    })}
                                </nav>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}

export default Navbar;
