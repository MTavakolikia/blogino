
import { Toaster } from "@/components/ui/sonner";
import "@/styles/globals.css";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>

        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-[url(/images/auth-background.jpg)] bg-cover">
          <div className="w-full max-w-sm bg-black/40  rounded-md py-8 border-2 border-cyan-300 backdrop-blur-2xl text-white">
            {children}
          </div>
          <Toaster />
        </div>
      </body>
    </html>
  );
}
