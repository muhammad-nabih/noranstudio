import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import { Cinzel, Poppins } from 'next/font/google'
import './globals.css'
import { BarbaProvider } from '@/components/providers/BarbaProvider'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { LoadingProvider } from '@/components/providers/LoadingProvider'
import MagicWandCursor from '@/components/common/Magicwandcursor'

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  weight: ['400', '500', '600', '700', '800', '900'],
})

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: ['300', '400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
  title: 'Creative Campaign Showcase',
  description: 'Immersive campaign and project showcase with advanced animations',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${cinzel.variable} ${poppins.variable}`}
    >
      {/*
        cursor-none hides the system cursor globally.
        MagicWandCursor renders its own fixed-position wand above everything.
        To restore the system cursor on a specific element, add className="cursor-auto".
      */}
      <body className="font-poppins antialiased cursor-none">
        <LoadingProvider>
          <ThemeProvider>
            <BarbaProvider>
              {/* ── Magic wand cursor — sits above all content ── */}
              <MagicWandCursor />

              <main>{children}</main>
            </BarbaProvider>
          </ThemeProvider>
        </LoadingProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}