// ビルド後に実行する。dist/index.html をもとに、ページごとの HTML・sitemap.xml・robots.txt を書き出す。
//
// このサイトはブラウザで描画する SPA だが、ページごとの <head>（タイトル・説明文・canonical・OGP・構造化データ）と
// JavaScript なしで読める本文の要約を HTML に直接書いておくことで、検索エンジンや SNS のクローラーに内容を伝える。
//
// サイトの URL は環境変数 SITE_URL で渡す（例: SITE_URL=https://example.com npm run build）。
// 未指定のときは、絶対 URL が必要な canonical・og:url・構造化データ・sitemap.xml は作らない。
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { indexablePages, jsonLd, notFoundMeta } from '../src/seo.ts'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')

function readSiteUrl() {
  const raw = process.env.SITE_URL?.trim()
  if (!raw) return null
  let url
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

const escapeHtml = (text) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** 既存のタグがあれば置き換え、なければ </head> の直前に追加する */
function setTag(html, pattern, tag) {
  return pattern.test(html) ? html.replace(pattern, () => tag) : html.replace('</head>', () => `    ${tag}\n  </head>`)
}

const metaPattern = (attr, key) => new RegExp(`<meta\\s+${attr}="${key}"[^>]*>`)

function renderPage(template, meta, siteUrl) {
  const title = escapeHtml(meta.title)
  const description = escapeHtml(meta.description)
  let html = template
  html = setTag(html, /<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
  html = setTag(html, metaPattern('name', 'description'), `<meta name="description" content="${description}" />`)
  html = setTag(html, metaPattern('property', 'og:title'), `<meta property="og:title" content="${title}" />`)
  html = setTag(html, metaPattern('property', 'og:description'), `<meta property="og:description" content="${description}" />`)

  if (meta.noindex) {
    html = setTag(html, metaPattern('name', 'robots'), '<meta name="robots" content="noindex" />')
  }
  if (siteUrl && !meta.noindex) {
    const url = escapeHtml(siteUrl + (meta.path === '/' ? '/' : meta.path))
    html = setTag(html, /<link\s+rel="canonical"[^>]*>/, `<link rel="canonical" href="${url}" />`)
    html = setTag(html, metaPattern('property', 'og:url'), `<meta property="og:url" content="${url}" />`)
    const data = jsonLd(meta, siteUrl)
    if (data) {
      // </script> などで途中終了しないよう < をエスケープする
      const json = JSON.stringify(data).replace(/</g, '\\u003c')
      html = setTag(html, /<script type="application\/ld\+json">[\s\S]*?<\/script>/, `<script type="application/ld+json">${json}</script>`)
    }
  }

  // JavaScript を実行しない環境向けの本文。ブラウザでは React が描画するので表示されない
  const fallback = [
    '<noscript>',
    `<h1>${escapeHtml(meta.heading)}</h1>`,
    `<p>${description}</p>`,
    '<p>最新の為替レートでの計算には JavaScript が必要です。</p>',
    '<nav><a href="/">プラン一覧</a> / <a href="/about">計算方法と注意事項</a></nav>',
    '</noscript>',
  ].join('')
  return html.replace('<div id="root"></div>', () => `<div id="root"></div>${fallback}`)
}

async function writeHtml(relativePath, html) {
  const file = path.join(dist, relativePath)
  await mkdir(path.dirname(file), { recursive: true })
  await writeFile(file, html)
  return relativePath
}

const siteUrl = readSiteUrl()
const template = await readFile(path.join(dist, 'index.html'), 'utf8')
const pages = indexablePages()
const written = []

for (const meta of pages) {
  const target = meta.path === '/' ? 'index.html' : path.join(meta.path.slice(1), 'index.html')
  written.push(await writeHtml(target, renderPage(template, meta, siteUrl)))
}
// 存在しないパスで返す HTML。多くの静的ホスティングが 404.html を自動で使う
written.push(await writeHtml('404.html', renderPage(template, notFoundMeta(), siteUrl)))

const robots = ['User-agent: *', 'Allow: /']
if (siteUrl) {
  const today = new Date().toISOString().slice(0, 10)
  const urls = pages
    .map((meta) => `  <url><loc>${escapeHtml(siteUrl + (meta.path === '/' ? '/' : meta.path))}</loc><lastmod>${today}</lastmod></url>`)
    .join('\n')
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
  written.push(await writeHtml('sitemap.xml', sitemap))
  robots.push('', `Sitemap: ${siteUrl}/sitemap.xml`)
} else {
  console.warn('SITE_URL が未指定のため、canonical・構造化データ・sitemap.xml は作りませんでした。')
}
written.push(await writeHtml('robots.txt', robots.join('\n') + '\n'))

console.log(`postbuild: ${written.length} files\n  ${written.join('\n  ')}`)
