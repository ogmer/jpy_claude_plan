import { getSiteUrl } from '../lib/siteUrl'
import { jsonLd, type PageMeta } from '../seo'

/** 構造化データ（JSON-LD）。サイトの URL が分からないときは何も出さない */
export function JsonLd({ meta }: { meta: PageMeta }) {
  const siteUrl = getSiteUrl()
  const data = siteUrl ? jsonLd(meta, siteUrl) : null
  if (!data) return null
  return (
    <script
      type="application/ld+json"
      // </script> などで途中終了しないよう < をエスケープする
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\u003c') }}
    />
  )
}
