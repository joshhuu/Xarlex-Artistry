import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Xarlex Artistry',
  description: 'Created by Joshua, Xarlex',
  generator: 'v0.dev',
  icons: {
    icon: '/logo.png',       // <-- favicon path here
    apple: '/logo.png',      // optional for Apple touch icon
    shortcut: '/logo.png',   // optional shortcut icon
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
