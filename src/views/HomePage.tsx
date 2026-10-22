import Link from 'next/link'
import { Suspense } from 'react'
import { HomePlans, HomePlansFallback } from './HomePlans'

export function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <section className="max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
          Claude Code の料金を日本円で
        </h1>
        <p className="mt-3 leading-relaxed text-stone-600 dark:text-stone-400">
          Claude Code
          が使える各プランの料金を、最新のドル円レートで日本円に換算しています。申し込みは、各プランのボタンから公式サイトでどうぞ。
        </p>
      </section>

      <Suspense fallback={<HomePlansFallback />}>
        <HomePlans />
      </Suspense>

      <aside className="mt-14 rounded-2xl bg-stone-100 p-5 text-sm leading-relaxed sm:p-6 dark:bg-stone-900">
        <h2 className="font-semibold">表示している金額について</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-stone-600 dark:text-stone-400">
          <li>
            円の金額は、公式サイトのドル価格を為替レートで換算した目安です。実際の請求額は、カード会社が決済を処理した日のレートで決まります。
          </li>
          <li>
            計算式や注意点は
            <Link
              href="/about"
              className="font-medium text-orange-700 underline-offset-4 hover:underline dark:text-orange-400"
            >
              計算方法と注意事項
            </Link>
            にまとめています。
          </li>
        </ul>
      </aside>
    </div>
  )
}
