import type { ReactNode } from 'react'
import { Link, NavLink, Outlet, ScrollRestoration } from 'react-router'
import { LogoMark } from '../components/icons'
import { OfficialLink } from '../components/OfficialLink'
import { RateBar } from '../components/RateBar'
import { OFFICIAL_PRICING_URL, PRICES_CHECKED_AT, SITE_NAME } from '../config'

export function RootLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <RateBar />
      <main className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
      <ScrollRestoration />
    </div>
  )
}

function SiteHeader() {
  return (
    <header className="border-b border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-950">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3">
        <Link to="/" className="flex items-center gap-2 font-bold">
          <LogoMark className="size-7" />
          {SITE_NAME}
          <span className="rounded border border-stone-300 px-1.5 text-[11px] font-medium text-stone-500 dark:border-stone-700 dark:text-stone-400">
            非公式
          </span>
        </Link>
        <nav aria-label="メイン" className="flex flex-wrap items-center gap-1 text-sm">
          <NavItem to="/">プラン一覧</NavItem>
          <NavItem to="/about">計算方法</NavItem>
          <OfficialLink href={OFFICIAL_PRICING_URL} className="px-3 py-1.5 whitespace-nowrap">
            公式の料金ページ
          </OfficialLink>
        </nav>
      </div>
    </header>
  )
}

function NavItem({ to, children }: { to: string; children: ReactNode }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `rounded-lg px-3 py-1.5 font-medium whitespace-nowrap ${
          isActive
            ? 'bg-stone-100 text-stone-900 dark:bg-stone-800 dark:text-white'
            : 'text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white'
        }`
      }
    >
      {children}
    </NavLink>
  )
}

function SiteFooter() {
  return (
    <footer className="border-t border-stone-200 text-xs text-stone-500 dark:border-stone-800 dark:text-stone-400">
      <div className="mx-auto max-w-6xl space-y-2 px-4 py-8 leading-relaxed">
        <p>
          このサイトは非公式の料金換算サイトで、Anthropic とは関係ありません。円の金額は
          {PRICES_CHECKED_AT}に公式サイトで確認したドル価格をもとに計算した目安です。正確な金額は
          <OfficialLink href={OFFICIAL_PRICING_URL}>公式の料金ページ</OfficialLink>
          とカード会社の明細で確認してください。
        </p>
        <p>
          <a
            href="https://www.exchangerate-api.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline-offset-2 hover:underline"
          >
            Rates By Exchange Rate API
          </a>
        </p>
      </div>
    </footer>
  )
}
