import { OFFICIAL_PRICING_URL } from '../config'
import { OfficialLink } from './OfficialLink'

export function SiteFooter() {
  return (
    <footer className="border-t border-stone-200 text-xs text-stone-500 dark:border-stone-800 dark:text-stone-400">
      <div className="mx-auto max-w-6xl space-y-2 px-4 py-8 leading-relaxed">
        <p>
          このサイトは非公式の料金換算サイトで、Anthropic とは関係ありません。円の金額は公式サイトで確認したドル価格をもとに計算した目安です。正確な金額は
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
