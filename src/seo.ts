// ビルド時のスクリプト（scripts/postbuild.mjs）からも読み込むため、
// このファイルは Node で直接実行できるよう、拡張子つきの import だけを使う。
import { SITE_NAME } from './config.ts'
import { findPlan, plans } from './data/plans.ts'

export interface PageMeta {
  /** サイト内のパス（例: /plans/pro） */
  path: string
  title: string
  /** ページの見出し（JavaScript なしで見たときの h1 にも使う） */
  heading: string
  description: string
  /** 検索結果に出したくないページ */
  noindex?: boolean
}

export const HOME_META: PageMeta = {
  path: '/',
  heading: 'Claude Code の料金を日本円で',
  title: `Claude Code の料金を日本円で | ${SITE_NAME}`,
  description:
    'Claude Code が使える Pro・Max・Team・Enterprise の各プランの料金を、最新のドル円レートで日本円に換算して一覧表示。消費税やカードの海外事務手数料も反映できる非公式サイトです。',
}

export const ABOUT_META: PageMeta = {
  path: '/about',
  heading: '計算方法と注意事項',
  title: `計算方法と注意事項 | ${SITE_NAME}`,
  description:
    'Claude Code の料金を日本円に換算する計算式、為替レートの取得元、消費税（JCT）、カードの海外事務手数料、アプリ内課金との価格差についての説明です。',
}

function planMeta(plan: NonNullable<ReturnType<typeof findPlan>>): PageMeta {
  const prices = [
    plan.priceUsd.monthly !== undefined && `月払い $${plan.priceUsd.monthly}`,
    plan.priceUsd.annual !== undefined && `年払い $${plan.priceUsd.annual}`,
  ].filter(Boolean)
  const unit = plan.seats ? '1席あたり' : ''
  const heading = `${plan.name} の料金（日本円）`
  return {
    path: `/plans/${plan.id}`,
    heading,
    title: `${heading} | ${SITE_NAME}`,
    description: `Claude Code が使える ${plan.name} プランの料金を日本円に換算。公式価格は${unit}${prices.join('・')}（税抜）。最新のドル円レート・消費税・海外事務手数料を反映した内訳と、公式サイトの申し込みページへのリンクを掲載。`,
  }
}

export function notFoundMeta(path = '/404'): PageMeta {
  return {
    path,
    heading: 'ページが見つかりません',
    title: `ページが見つかりません | ${SITE_NAME}`,
    description: 'URL が間違っているか、ページが移動した可能性があります。',
    noindex: true,
  }
}

export function pageMetaFor(pathname: string): PageMeta {
  if (pathname === '/') return HOME_META
  if (pathname === '/about') return ABOUT_META
  const match = /^\/plans\/([^/]+)$/.exec(pathname)
  const plan = match ? findPlan(match[1]) : undefined
  return plan ? planMeta(plan) : notFoundMeta(pathname)
}

/** 検索エンジンに登録してほしいページの一覧 */
export function indexablePages(): PageMeta[] {
  return [HOME_META, ...plans.map((plan) => planMeta(plan)), ABOUT_META]
}

/** 構造化データ（JSON-LD）。サイトの URL が分かるときだけ作れる */
export function jsonLd(meta: PageMeta, siteUrl: string): object | null {
  if (meta.noindex) return null
  const context = 'https://schema.org'
  if (meta.path === '/') {
    return {
      '@context': context,
      '@type': 'WebSite',
      name: SITE_NAME,
      url: `${siteUrl}/`,
      inLanguage: 'ja',
      description: meta.description,
    }
  }
  return {
    '@context': context,
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'プラン一覧', item: `${siteUrl}/` },
      { '@type': 'ListItem', position: 2, name: meta.heading, item: `${siteUrl}${meta.path}` },
    ],
  }
}
