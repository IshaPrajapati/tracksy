import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/shared/theme-provider'
import { Toaster } from 'sonner'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    default: 'Tracksy — Project Management Tool',
    template: '%s | Tracksy',
  },
  description:
    'Tracksy is a modern, real-time project management tool with Kanban boards, task tracking, team collaboration, and analytics.',
  keywords: ['project management', 'kanban', 'tasks', 'collaboration', 'team'],
  authors: [{ name: 'Tracksy' }],
  creator: 'Tracksy',
  openGraph: {
    type: 'website',
    title: 'Tracksy',
    description: 'Modern real-time project management',
    siteName: 'Tracksy',
  },
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster
            position="bottom-right"
            richColors
            theme="dark"
            toastOptions={{
              style: {
                background: 'hsl(222 47% 8%)',
                border: '1px solid hsl(217.2 32.6% 14%)',
                color: 'hsl(210 40% 98%)',
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
