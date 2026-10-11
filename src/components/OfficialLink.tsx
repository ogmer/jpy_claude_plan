import type { ReactNode } from 'react'
import { ExternalLinkIcon } from './icons'

interface OfficialLinkProps {
  href: string
  children: ReactNode
  variant?: 'button' | 'text'
  className?: string
}

const VARIANT_CLASS = {
  button:
    'justify-center rounded-xl bg-orange-700 px-4 py-2.5 font-semibold text-white shadow-sm hover:bg-orange-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700',
  text: 'font-medium text-orange-700 underline-offset-4 hover:underline dark:text-orange-400',
}

/** 公式サイトなど外部ページへのリンク。新しいタブで開く */
export function OfficialLink({ href, children, variant = 'text', className = '' }: OfficialLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1.5 ${VARIANT_CLASS[variant]} ${className}`}
    >
      {children}
      <ExternalLinkIcon className="size-4 shrink-0" />
      <span className="sr-only">（新しいタブで開きます）</span>
    </a>
  )
}
