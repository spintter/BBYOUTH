import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Knowledge Is Power - Youth Ministry',
  description: 'Supporting the humanities in Birmingham Alabama through youth ministry and education.'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
      </head>
      <body>{children}</body>
    </html>
  )
} 