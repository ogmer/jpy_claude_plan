import type { Metadata } from 'next'
import { SITE_NAME } from '../config'
import type { PageMeta } from '../seo'
import { getSiteUrl } from './siteUrl'

/** ページごとの title・description・canonical・OGP を Next.js の Metadata に変換する */
export function toMetadata(meta: PageMeta): Metadata {
  const hasSiteUrl = getSiteUrl() !== null
  return {
    title: { absolute: meta.title },
    description: meta.description,
    robots: meta.noindex ? { index: false } : undefined,
    // canonical は絶対 URL が必要なので、サイトの URL が分かるときだけ出す
    alternates: hasSiteUrl && !meta.noindex ? { canonical: meta.path } : undefined,
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      locale: 'ja_JP',
      title: meta.title,
      description: meta.description,
      url: hasSiteUrl && !meta.noindex ? meta.path : undefined,
    },
  }
}
