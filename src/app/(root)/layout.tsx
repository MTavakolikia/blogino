import type { Metadata } from "next";
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import Navbar from "@/components/root/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import { Toaster } from "@/components/ui/sonner";



export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          {children}
          <Footer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
