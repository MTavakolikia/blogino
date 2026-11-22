"use client"

import * as React from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

const pages: { title: string; href: string; description: string }[] = [
    {
        title: "Home",
        href: "/",
        description: "The latest articles, front and centre.",
    },
    {
        title: "All articles",
        href: "/post",
        description: "Browse the full archive with categories and search.",
    },
    {
        title: "About",
        href: "/about-me",
        description: "What Blogino is, and who writes it.",
    },
    {
        title: "Contact",
        href: "/contact-me",
        description: "Feedback, pitches and everything in between.",
    },
]

export function NavigationMenuBar() {
    return (
        <nav>
            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>Explore</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[460px] lg:grid-cols-2">
                                {pages.map((page) => (
                                    <ListItem
                                        key={page.href}
                                        title={page.title}
                                        href={page.href}
                                    >
                                        {page.description}
                                    </ListItem>
                                ))}
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <Link href="/about-me" legacyBehavior passHref>
                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                About Me
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <Link href="/contact-me" legacyBehavior passHref>
                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                Contact Me
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
        </nav>
    )
}

const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    Omit<React.ComponentPropsWithoutRef<"a">, "href"> & {
        href: string
        title: string
    }
>(({ className, title, children, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <Link
                    ref={ref}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className
                    )}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </Link>
            </NavigationMenuLink>
        </li>
    )
})
ListItem.displayName = "ListItem"
