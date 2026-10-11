import { Link, useSearchParams } from 'react-router'
import { BillingToggle } from '../components/BillingToggle'
import { PlanCard } from '../components/PlanCard'
import { PlatformNotice } from '../components/PlatformNotice'
import { Seo } from '../components/Seo'
import { HOME_META } from '../seo'
import { GROUP_LABEL, plans, type BillingCycle, type PlanGroup } from '../data/plans'

/** 支払い方法は ?billing=annual で URL に残し、共有やリロードでも保たれるようにする */
function parseBilling(value: string | null): BillingCycle {
  return value === 'annual' ? 'annual' : 'monthly'
}

export function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const billing = parseBilling(searchParams.get('billing'))

  const changeBilling = (cycle: BillingCycle) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (cycle === 'annual') next.set('billing', 'annual')
        else next.delete('billing')
        return next
      },
      { replace: true, preventScrollReset: true },
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <Seo meta={HOME_META} />

      <section className="max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
          Claude Code の料金を日本円で
        </h1>
        <p className="mt-3 leading-relaxed text-stone-600 dark:text-stone-400">
          Claude Code
          が使える各プランの料金を、最新のドル円レートで日本円に換算しています。申し込みは、各プランのボタンから公式サイトでどうぞ。
        </p>
      </section>

      <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2">
        <BillingToggle value={billing} onChange={changeBilling} />
        <p className="text-sm text-stone-500 dark:text-stone-400">
          年払いは Pro・Team・Enterprise で選べます
        </p>
      </div>

      <div className="mt-6 max-w-3xl">
        <PlatformNotice withLink />
      </div>

      <PlanSection group="individual" billing={billing} />
      <PlanSection group="team" billing={billing} note="価格は1席あたりです。" />

      <aside className="mt-14 rounded-2xl bg-stone-100 p-5 text-sm leading-relaxed sm:p-6 dark:bg-stone-900">
        <h2 className="font-semibold">表示している金額について</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-stone-600 dark:text-stone-400">
          <li>
            円の金額は、公式サイトのドル価格を為替レートで換算した目安です。実際の請求額は、カード会社が決済を処理した日のレートで決まります。
          </li>
          <li>
            計算式や注意点は
            <Link
              to="/about"
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

interface PlanSectionProps {
  group: PlanGroup
  billing: BillingCycle
  note?: string
}

function PlanSection({ group, billing, note }: PlanSectionProps) {
  const headingId = `plans-${group}`
  return (
    <section aria-labelledby={headingId} className="mt-10">
      <div className="flex flex-wrap items-baseline gap-x-3">
        <h2 id={headingId} className="text-lg font-bold">
          {GROUP_LABEL[group]}プラン
        </h2>
        {note && <p className="text-sm text-stone-500 dark:text-stone-400">{note}</p>}
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {plans
          .filter((plan) => plan.group === group)
          .map((plan) => (
            <PlanCard key={plan.id} plan={plan} billing={billing} />
          ))}
      </div>
    </section>
  )
}
