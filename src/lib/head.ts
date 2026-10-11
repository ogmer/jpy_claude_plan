import type { PageMeta } from '../seo.ts'

function setMeta(attr: 'name' | 'property', key: string, content: string | null): void {
  const selector = `meta[${attr}="${key}"]`
  let element = document.head.querySelector<HTMLMetaElement>(selector)
  if (content === null) {
    element?.remove()
    return
  }
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attr, key)
    document.head.append(element)
  }
  element.content = content
}

/**
 * 画面遷移のたびに <head> の内容を更新する。
 * ビルド時に各ページの HTML へ同じ内容を書き込んでいるので、ここでは既存のタグを書き換えるだけにして、重複させない。
 */
export function applyPageMeta(meta: PageMeta): void {
  document.title = meta.title
  setMeta('name', 'description', meta.description)
  setMeta('property', 'og:title', meta.title)
  setMeta('property', 'og:description', meta.description)
  setMeta('name', 'robots', meta.noindex ? 'noindex' : null)

  const canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (canonical) {
    const url = new URL(meta.path, canonical.href).href
    canonical.href = url
    setMeta('property', 'og:url', url)
  }
}
