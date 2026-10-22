'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { LogoMark } from './icons'
import { OfficialLink } from './OfficialLink'
import { OFFICIAL_PRICING_URL, SITE_NAME } from '../config'

export function SiteHeader() {
  return (
    <header className="border-b border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-950">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <LogoMark className="size-7" />
          {SITE_NAME}
          <span className="rounded border border-stone-300 px-1.5 text-[11px] font-medium text-stone-500 dark:border-stone-700 dark:text-stone-400">
            非公式
          </span>
        </Link>
        <nav aria-label="メイン" className="flex flex-wrap items-center gap-1 text-sm">
          <NavItem href="/">プラン一覧</NavItem>
          <NavItem href="/about">計算方法</NavItem>
          <OfficialLink href={OFFICIAL_PRICING_URL} className="px-3 py-1.5 whitespace-nowrap">
            公式の料金ページ
          </OfficialLink>
        </nav>
      </div>
    </header>
  )
}

function NavItem({ href, children }: { href: string; children: ReactNode }) {
  const isActive = usePathname() === href
  return (
    <Link
      href={href}
      aria-current={isActive ? 'page' : undefined}
      className={`rounded-lg px-3 py-1.5 font-medium whitespace-nowrap ${
        isActive
          ? 'bg-stone-100 text-stone-900 dark:bg-stone-800 dark:text-white'
          : 'text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white'
      }`}
    >
      {children}
    </Link>
  )
}
