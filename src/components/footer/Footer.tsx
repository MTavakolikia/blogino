import Link from "next/link";
import { Rss } from "lucide-react";

const COLUMNS = [
    {
        title: "Explore",
        links: [
            { href: "/", label: "Home" },
            { href: "/post", label: "All articles" },
            { href: "/about-me", label: "About" },
            { href: "/contact-me", label: "Contact" },
        ],
    },
    {
        title: "For writers",
        links: [
            { href: "/register", label: "Create account" },
            { href: "/login", label: "Log in" },
            { href: "/dashboard/posts/create", label: "Write a post" },
            { href: "/dashboard", label: "Dashboard" },
        ],
    },
];

export default function Footer() {
    const year = new Date().getFullYear();
    return (
        <footer className="mt-8 border-t border-border/70 bg-muted/20">
            <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-10 md:grid-cols-4 md:px-6 md:py-14">
                <div className="col-span-2 md:col-span-2">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Rss className="h-5 w-5" />
                        </span>
                        <span className="text-lg font-semibold tracking-tighter">
                            Blogino
                        </span>
                    </Link>
                    <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
                        In-depth articles on technology, programming, design,
                        business and science — written to be read.
                    </p>
                </div>

                {COLUMNS.map((col) => (
                    <div key={col.title}>
                        <h3 className="text-sm font-semibold text-foreground">
                            {col.title}
                        </h3>
                        <ul className="mt-4 space-y-2.5">
                            {col.links.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <div className="border-t border-border/60">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row md:px-6">
                    <p>© {year} Blogino. All rights reserved.</p>
                    <p>Built with Next.js &amp; Magic UI.</p>
                </div>
            </div>
        </footer>
    );
}
