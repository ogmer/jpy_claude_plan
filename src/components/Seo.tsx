import { useEffect } from 'react'
import { applyPageMeta } from '../lib/head'
import type { PageMeta } from '../seo'

/** ページごとのタイトル・説明文などを <head> に反映する。画面には何も描画しない */
export function Seo({ meta }: { meta: PageMeta }) {
  const { path, heading, title, description, noindex } = meta
  useEffect(() => {
    applyPageMeta({ path, heading, title, description, noindex })
  }, [path, heading, title, description, noindex])
  return null
}
