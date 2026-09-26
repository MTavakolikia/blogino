import { AppSidebar } from "@/components/dashboard/sidebar/app-sidebar"
import "@/styles/globals.css";
import { cookies } from "next/headers";
import { LayoutDashboard } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator";
import { ThemeToggler } from "@/components/root/navbar/ThemeToggler";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

// Same "theme" cookie as the main site — rendered server-side so the saved
// theme is applied before first paint, without any pre-hydration <script>.
async function getThemeClass(): Promise<"light" | "dark" | ""> {
  try {
    const stored = (await cookies()).get("theme")?.value
    return stored === "light" || stored === "dark" ? stored : ""
  } catch {
    return ""
  }
}

export default async function Layout({ children }: { children: React.ReactNode }) {
  const themeClass = await getThemeClass()

  return (
    <html lang="en" suppressHydrationWarning className={themeClass || undefined}>
      <body>
        <ThemeProvider>
          <TooltipProvider>
            <SidebarProvider>
              <AppSidebar />
              <main className="w-full">
                <header className="sticky top-0 z-40 flex h-16 items-center gap-2 border-b border-border/60 bg-background/80 px-4 backdrop-blur-md transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                  <SidebarTrigger className="-ml-1" />
                  <Separator orientation="vertical" className="mr-2 h-4" />
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <LayoutDashboard className="h-4 w-4 text-primary" />
                    Dashboard
                  </div>
                  <div className="ml-auto">
                    <ThemeToggler />
                  </div>
                </header>
                <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">{children}</div>
              </main>
              <Toaster />
            </SidebarProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
