'use client'

import Link from 'next/link'
import { planHighlights, type BillingCycle, type Plan } from '../data/plans'
import { formatUsd, formatYen } from '../lib/format'
import { CYCLE_MONTHS, CYCLE_UNIT, pickPriceOption, toYen } from '../lib/pricing'
import { usePricing } from '../pricing/PricingContext'
import { ArrowRightIcon, CheckIcon } from './icons'
import { OfficialLink } from './OfficialLink'
import { AmountSkeleton } from './Yen'

interface PlanCardProps {
  plan: Plan
  billing: BillingCycle
}

export function PlanCard({ plan, billing }: PlanCardProps) {
  const { options, settings } = usePricing()
  const price = pickPriceOption(plan, billing)
  const total = options && toYen(price.usd, options).total
  const perMonth = total === null ? null : total / CYCLE_MONTHS[price.cycle]
  const seatUnit = plan.seats ? '席・' : ''

  return (
    <article className="flex flex-col rounded-2xl border border-stone-200 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900">
      <h3 className="text-xl font-bold">{plan.name}</h3>
      <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">{plan.summary}</p>

      <div className="mt-5">
        <p className="flex flex-wrap items-baseline gap-x-1">
          <span className="text-sm text-stone-500 dark:text-stone-400">約</span>
          {perMonth === null ? (
            <AmountSkeleton className="h-9 w-32 self-center" />
          ) : (
            <span className="text-4xl font-bold tracking-tight tabular-nums">
              {formatYen(perMonth)}
            </span>
          )}
          <span className="font-semibold">円</span>
          <span className="text-sm text-stone-500 dark:text-stone-400">/ {seatUnit}月</span>
          <span className="ml-1 rounded-full bg-stone-100 px-2 py-0.5 text-xs font-medium text-stone-600 dark:bg-stone-800 dark:text-stone-300">
            {settings.includeTax ? '税込' : '税抜'}
          </span>
        </p>
        {price.cycle === 'annual' && total !== null && (
          <p className="mt-1 text-sm text-stone-600 dark:text-stone-300">
            年額 約{formatYen(total)}円をまとめて支払い
          </p>
        )}
        <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
          公式価格 {formatUsd(price.usd)} / {seatUnit}
          {CYCLE_UNIT[price.cycle]}（税抜）
        </p>
        {price.cycle !== billing && (
          <p className="mt-2 text-xs font-medium text-amber-800 dark:text-amber-300">
            {billing === 'annual' ? '年払いはなく、月払いのみです' : '年払いのみのプランです'}
          </p>
        )}
        {plan.metered && (
          <p className="mt-2 text-xs font-medium text-amber-800 dark:text-amber-300">
            ＋ 利用量に応じた API 料金（従量課金）
          </p>
        )}
      </div>

      <ul className="mt-5 flex-1 space-y-2 text-sm">
        {planHighlights(plan).map((item) => (
          <li key={item} className="flex gap-2">
            <CheckIcon className="mt-0.5 size-4 shrink-0 text-orange-700 dark:text-orange-400" />
            {item}
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-col gap-3">
        <OfficialLink href={plan.signup.url} variant="button">
          {plan.signup.label}
        </OfficialLink>
        <Link
          href={`/plans/${plan.id}`}
          className="inline-flex items-center justify-center gap-1 text-sm font-medium text-stone-700 hover:text-orange-700 dark:text-stone-300 dark:hover:text-orange-400"
        >
          円での内訳を見る
          <ArrowRightIcon className="size-4" />
        </Link>
      </div>
    </article>
  )
}
