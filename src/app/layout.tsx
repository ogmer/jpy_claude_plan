import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { RateBar } from '../components/RateBar'
import { SiteFooter } from '../components/SiteFooter'
import { SiteHeader } from '../components/SiteHeader'
import { SITE_NAME } from '../config'
import { getSiteUrl } from '../lib/siteUrl'
import { PricingProvider } from '../pricing/PricingProvider'
import { HOME_META } from '../seo'
import './globals.css'

const siteUrl = getSiteUrl()

export const metadata: Metadata = {
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
  title: HOME_META.title,
  description: HOME_META.description,
  applicationName: SITE_NAME,
  icons: { icon: '/favicon.svg' },
  openGraph: { type: 'website', siteName: SITE_NAME, locale: 'ja_JP' },
  twitter: { card: 'summary' },
}

export const viewport: Viewport = {
  themeColor: '#c2410c',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <PricingProvider>
          <div className="flex min-h-dvh flex-col">
            <SiteHeader />
            <RateBar />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
        </PricingProvider>
        <Analytics />
      </body>
    </html>
  )
}
