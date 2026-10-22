import type { MetadataRoute } from 'next'
import { getSiteUrl } from '../lib/siteUrl'
import { indexablePages } from '../seo'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl()
  // 絶対 URL が必要なので、サイトの URL が分からないときは空にする
  if (!siteUrl) return []
  const lastModified = new Date()
  return indexablePages().map((meta) => ({
    url: siteUrl + (meta.path === '/' ? '/' : meta.path),
    lastModified,
  }))
}
