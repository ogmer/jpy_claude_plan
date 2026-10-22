'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { BillingToggle } from '../components/BillingToggle'
import { PlanCard } from '../components/PlanCard'
import { PlatformNotice } from '../components/PlatformNotice'
import { GROUP_LABEL, plans, type BillingCycle, type PlanGroup } from '../data/plans'

/** 支払い方法は ?billing=annual で URL に残し、共有やリロードでも保たれるようにする */
function parseBilling(value: string | null): BillingCycle {
  return value === 'annual' ? 'annual' : 'monthly'
}

/** 月払い／年払いの切り替えとプラン一覧。URL の検索パラメータを読むので、Suspense の内側で使う */
export function HomePlans() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const billing = parseBilling(searchParams.get('billing'))

  const changeBilling = (cycle: BillingCycle) => {
    const next = new URLSearchParams(searchParams.toString())
    if (cycle === 'annual') next.set('billing', 'annual')
    else next.delete('billing')
    const query = next.toString()
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }

  return <PlansView billing={billing} onChange={changeBilling} />
}

/** 検索パラメータを読み終えるまでの表示。サーバーでも月払いの一覧を描画しておく */
export function HomePlansFallback() {
  return <PlansView billing="monthly" onChange={() => {}} />
}

interface PlansViewProps {
  billing: BillingCycle
  onChange: (cycle: BillingCycle) => void
}

function PlansView({ billing, onChange }: PlansViewProps) {
  return (
    <>
      <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2">
        <BillingToggle value={billing} onChange={onChange} />
        <p className="text-sm text-stone-500 dark:text-stone-400">
          年払いは Pro・Team・Enterprise で選べます
        </p>
      </div>

      <div className="mt-6 max-w-3xl">
        <PlatformNotice withLink />
      </div>

      <PlanSection group="individual" billing={billing} />
      <PlanSection group="team" billing={billing} note="価格は1席あたりです。" />
    </>
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
