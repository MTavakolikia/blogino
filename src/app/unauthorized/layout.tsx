import "@/styles/globals.css";


export const metadata = {
  title: '403 | Unauthorized',
  description: 'You don\'t have permission to access this page.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
