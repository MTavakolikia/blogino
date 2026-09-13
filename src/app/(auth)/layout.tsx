import { cookies } from "next/headers";

import { Toaster } from "@/components/ui/sonner";
import "@/styles/globals.css";

// Apply the saved theme class on first paint (same "theme" cookie as the
// main site) so auth pages match the rest of the app.
async function getThemeClass(): Promise<string> {
    try {
        const stored = (await cookies()).get("theme")?.value;
        return stored === "light" || stored === "dark" ? stored : "";
    } catch {
        return "";
    }
}

export default async function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const themeClass = await getThemeClass();

    return (
        <html lang="en" suppressHydrationWarning className={themeClass || undefined}>
            <body>
                <div className="relative flex min-h-svh w-full items-center justify-center p-4 py-10 md:p-6">
                    <div
                        aria-hidden
                        className="absolute inset-0 bg-[url(/images/auth-background.jpg)] bg-cover bg-center"
                    />
                    <div
                        aria-hidden
                        className="absolute inset-0 bg-background/75 backdrop-blur-[3px] dark:bg-background/60"
                    />

                    <div className="relative w-full max-w-sm rounded-2xl border border-border/70 bg-card/90 p-6 shadow-xl backdrop-blur-xl md:p-8">
                        {children}
                    </div>
                </div>
                <Toaster />
            </body>
        </html>
    );
}
