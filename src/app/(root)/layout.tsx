import type { Metadata } from "next";
import { cookies } from "next/headers";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import Navbar from "@/components/root/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import BottomNav from "@/components/root/bottom-nav/BottomNav";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
    title: {
        default: "Blogino",
        template: "%s · Blogino",
    },
    description:
        "Blogino — modern articles on technology, programming, design, business and more. Real, in-depth posts written by a team of authors.",
    keywords: [
        "blog",
        "technology",
        "programming",
        "web development",
        "design",
        "business",
        "science",
    ],
};

// The "theme" cookie mirrors the user's explicit choice (set client-side by
// the ThemeProvider). Rendering it as a class on <html> server-side applies
// the right theme before first paint — no pre-hydration <script> needed.
async function getThemeClass(): Promise<"light" | "dark" | ""> {
    try {
        const stored = (await cookies()).get("theme")?.value;
        return stored === "light" || stored === "dark" ? stored : "";
    } catch {
        return "";
    }
}

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const themeClass = await getThemeClass();

    return (
        <html
            lang="en"
            suppressHydrationWarning
            className={`${GeistSans.variable} ${GeistMono.variable} antialiased${themeClass ? ` ${themeClass}` : ""}`}
        >
            <body className="min-h-dvh flex flex-col">
                <ThemeProvider>
                    <Navbar />
                    <main className="flex-1 pb-16 md:pb-0">{children}</main>
                    <Footer />
                    <BottomNav />
                    <Toaster />
                </ThemeProvider>
            </body>
        </html>
    );
}
