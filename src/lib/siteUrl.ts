/**
 * サイトの URL（末尾スラッシュなし）。canonical・og:url・構造化データ・sitemap.xml の絶対 URL に使う。
 * 環境変数 SITE_URL を優先し、なければ Vercel が渡す本番ドメインを使う。どちらもなければ null。
 */
export function getSiteUrl(): string | null {
  const raw =
    process.env.SITE_URL?.trim() ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : '')
  if (!raw) return null
  let url: URL
  try {
    url = new URL(raw)
  } catch {
    throw new Error(`SITE_URL が URL として正しくありません: ${raw}`)
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    throw new Error(`SITE_URL は http(s) の URL を指定してください: ${raw}`)
  }
  return url.origin + url.pathname.replace(/\/$/, '')
}
