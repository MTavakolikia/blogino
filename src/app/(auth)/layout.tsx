
export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <main className="h-full w-full flex items-center justify-centerS">
          {children}
        </main>
      </body>
    </html>
  );
}
