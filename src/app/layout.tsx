import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Velvet - Discreet Connections',
  description: 'AI-powered dating platform for meaningful, discreet connections',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}