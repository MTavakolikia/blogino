import { AppSidebar } from "@/components/sidebar/app-sidebar"
import "@/styles/globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator";
import { ThemeToggler } from "@/components/navbar/ThemeToggler";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider>
            <AppSidebar />
            <main className="w-full">
              <header className="flex h-16  items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                <div className="flex justify-between w-full items-center gap-2 px-4">
                  <div className="flex items-center">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <p>Welcome To Blogify</p>
                  </div>
                  <ThemeToggler />
                </div>
              </header>
              {children}
              <Toaster />
            </main>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
