import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Drinkly - Order Responsibly. Delivered Legally.',
  description:
    'Order your favorite alcoholic beverages from licensed retailers. Age-verified delivery with responsible drinking at the forefront.',
  keywords: [
    'alcohol delivery',
    'liquor delivery',
    'wine delivery',
    'beer delivery',
    'licensed retailer',
    'responsible drinking',
  ],
  authors: [{ name: 'Drinkly' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://drinkly.com',
    siteName: 'Drinkly',
    title: 'Drinkly - Order Responsibly. Delivered Legally.',
    description:
      'Order your favorite alcoholic beverages from licensed retailers. Age-verified delivery with responsible drinking at the forefront.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Drinkly - Alcohol Delivery',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Drinkly - Order Responsibly. Delivered Legally.',
    description:
      'Order your favorite alcoholic beverages from licensed retailers.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={`${inter.variable} font-sans antialiased bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100`}
      >
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1a1a1a',
              color: '#fff',
              borderRadius: '12px',
            },
          }}
        />
        {children}
      </body>
    </html>
  )
}
