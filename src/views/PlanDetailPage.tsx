'use client'

import Link from 'next/link'
import { useId, useState, type ReactNode } from 'react'
import { CheckIcon } from '../components/icons'
import { OfficialLink } from '../components/OfficialLink'
import { PlatformNotice } from '../components/PlatformNotice'
import { Yen } from '../components/Yen'
import { OFFICIAL_PRICING_URL } from '../config'
import {
  GROUP_LABEL,
  planHighlights,
  plans,
  type BillingCycle,
  type Plan,
  type SeatRange,
} from '../data/plans'
import { formatRate, formatUsd, formatYen } from '../lib/format'
import {
  CYCLE_LABEL,
  CYCLE_MONTHS,
  CYCLE_UNIT,
  JCT_RATE,
  priceOptions,
  toYen,
  type PricingOptions,
} from '../lib/pricing'
import { usePricing } from '../pricing/PricingContext'

export function PlanDetailPage({ plan }: { plan: Plan }) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
      <nav aria-label="パンくずリスト" className="text-sm text-stone-500 dark:text-stone-400">
        <ol className="flex flex-wrap gap-2">
          <li>
            <Link href="/" className="hover:text-stone-900 hover:underline dark:hover:text-white">
              プラン一覧
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-stone-900 dark:text-white">
            {plan.name}
          </li>
        </ol>
      </nav>

      <header className="mt-6">
        <p className="text-sm font-medium text-orange-700 dark:text-orange-400">
          {GROUP_LABEL[plan.group]}
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">{plan.name}</h1>
        <p className="mt-2 text-stone-600 dark:text-stone-400">{plan.summary}</p>
      </header>

      <Breakdown plan={plan} />
      {plan.seats && <SeatCalculator key={plan.id} plan={plan} seats={plan.seats} />}

      <section aria-labelledby="features-heading" className="mt-10">
        <h2 id="features-heading" className="text-lg font-bold">
          プランの特徴
        </h2>
        <ul className="mt-3 space-y-2">
          {planHighlights(plan).map((item) => (
            <li key={item} className="flex gap-2">
              <CheckIcon className="mt-1 size-4 shrink-0 text-orange-700 dark:text-orange-400" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-10">
        <PlatformNotice withLink />
      </div>

      <section className="mt-6 flex flex-col items-start gap-4 rounded-2xl border border-orange-200 bg-orange-50 p-6 sm:flex-row sm:items-center sm:justify-between dark:border-orange-900/60 dark:bg-orange-950/30">
        <p className="font-medium">申し込みは公式サイトで行います</p>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <OfficialLink href={plan.signup.url} variant="button">
            {plan.signup.label}
          </OfficialLink>
          <OfficialLink href={OFFICIAL_PRICING_URL} className="text-sm">
            公式の料金ページ
          </OfficialLink>
        </div>
      </section>

      <OtherPlans currentId={plan.id} />
    </div>
  )
}

function Breakdown({ plan }: { plan: Plan }) {
  const { options, settings } = usePricing()
  const columns = priceOptions(plan).map((price) => ({
    ...price,
    yen: options && toYen(price.usd, options),
  }))

  const monthly = columns.find((column) => column.cycle === 'monthly')?.yen
  const annual = columns.find((column) => column.cycle === 'annual')?.yen
  const yearlyByMonthly = monthly ? monthly.total * 12 : null
  const savings = yearlyByMonthly !== null && annual ? yearlyByMonthly - annual.total : null

  return (
    <section aria-labelledby="breakdown-heading" className="mt-10">
      <h2 id="breakdown-heading" className="text-lg font-bold">
        料金の内訳{plan.seats && '（1席あたり）'}
      </h2>
      <div className="mt-3 overflow-x-auto rounded-2xl border border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900">
        <table className="w-full text-sm">
          <caption className="border-b border-stone-200 px-4 py-3 text-left text-stone-500 dark:border-stone-800 dark:text-stone-400">
            {options
              ? `1ドル = ${formatRate(options.rate)}円で換算`
              : '為替レートを取得しています…'}
          </caption>
          <thead>
            <tr className="text-stone-500 dark:text-stone-400">
              <th scope="col" className={`${CELL_CLASS} text-left font-medium`}>
                項目
              </th>
              {columns.map(({ cycle }) => (
                <th
                  key={cycle}
                  scope="col"
                  className={`${CELL_CLASS} text-right font-medium whitespace-nowrap`}
                >
                  {CYCLE_LABEL[cycle]}
                  <span className="block text-xs font-normal">{BILLING_TIMING[cycle]}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
            <Row label="公式価格（税抜）" cells={columns.map(({ usd }) => formatUsd(usd))} />
            {settings.includeTax && (
              <Row
                label="消費税（10%）"
                cells={columns.map(({ usd }) => formatUsd(usd * JCT_RATE))}
              />
            )}
            {settings.feePercent > 0 && (
              <Row
                label={`手数料（${settings.feePercent}%）`}
                cells={columns.map(({ yen }, i) => (
                  <Yen key={i} value={yen?.fee ?? null} />
                ))}
              />
            )}
            <Row
              label="支払額の目安"
              emphasis
              cells={columns.map(({ yen }, i) => (
                <Yen key={i} value={yen?.total ?? null} />
              ))}
            />
            <Row
              label="1か月あたり"
              cells={columns.map(({ cycle, yen }, i) => (
                <Yen key={i} value={yen ? yen.total / CYCLE_MONTHS[cycle] : null} />
              ))}
            />
            <Row
              label="1年あたり"
              cells={columns.map(({ cycle, yen }, i) => (
                <Yen key={i} value={yen ? (yen.total * 12) / CYCLE_MONTHS[cycle] : null} />
              ))}
            />
          </tbody>
        </table>
      </div>

      <div className="mt-3 space-y-1 text-sm text-stone-600 dark:text-stone-400">
        {yearlyByMonthly !== null && savings !== null && savings > 0 && (
          <p>
            年払いにすると、月払いより1年で約{formatYen(savings)}円（
            {Math.round((savings / yearlyByMonthly) * 100)}%）安くなります。
          </p>
        )}
        {columns.length === 1 && (
          <p>{CYCLE_LABEL[columns[0].cycle]}のみのプランです。</p>
        )}
        {plan.metered && (
          <p className="font-medium text-amber-800 dark:text-amber-300">
            席料金のほかに、利用量に応じた API 料金が別途かかります。
          </p>
        )}
      </div>
    </section>
  )
}

/** 金額のセルを「/ 月」なしで済ませ、スマホでも3列が収まるようにする */
const BILLING_TIMING: Record<BillingCycle, string> = {
  monthly: '毎月の請求',
  annual: '年1回の請求',
}

const CELL_CLASS = 'px-2.5 py-3 sm:px-4'

interface RowProps {
  label: string
  /** 支払い方法ごとの列の中身 */
  cells: ReactNode[]
  emphasis?: boolean
}

function Row({ label, cells, emphasis = false }: RowProps) {
  return (
    <tr className={emphasis ? 'bg-orange-50/60 font-bold dark:bg-orange-950/20' : undefined}>
      {/* 狭い画面では「公式価格／（税抜）」のように括弧の前でだけ折り返す */}
      <th scope="row" className={`${CELL_CLASS} text-left font-medium break-keep`}>
        {label}
      </th>
      {cells.map((cell, index) => (
        <td key={index} className={`${CELL_CLASS} text-right whitespace-nowrap tabular-nums`}>
          {cell}
        </td>
      ))}
    </tr>
  )
}

/** 入力欄で受け付ける席数の上限（上限のないプラン用） */
const MAX_SEATS_INPUT = 10000

function seatRangeText({ min, max }: SeatRange): string {
  return max ? `${min}〜${max}席で契約できます。` : `最低${min}席から契約できます。`
}

function SeatCalculator({ plan, seats }: { plan: Plan; seats: SeatRange }) {
  const { options } = usePricing()
  const [text, setText] = useState(String(seats.min))
  const inputId = useId()
  const hintId = useId()
  const max = seats.max ?? MAX_SEATS_INPUT
  const parsed = Number.parseInt(text, 10)
  const count = Number.isNaN(parsed) ? seats.min : Math.min(Math.max(parsed, 1), max)

  return (
    <section aria-labelledby="seats-heading" className="mt-10">
      <h2 id="seats-heading" className="text-lg font-bold">
        席数で計算
      </h2>
      <div className="mt-3 rounded-2xl border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <label htmlFor={inputId} className="font-medium">
            席数
          </label>
          <input
            id={inputId}
            type="number"
            inputMode="numeric"
            min={1}
            max={max}
            step={1}
            value={text}
            aria-describedby={hintId}
            onChange={(e) => setText(e.target.value)}
            className="w-24 rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-right tabular-nums dark:border-stone-700 dark:bg-stone-800"
          />
          席
          <span id={hintId} className="text-stone-500 dark:text-stone-400">
            {seatRangeText(seats)}
          </span>
        </div>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          {priceOptions(plan).map(({ cycle, usd }) => (
            <SeatTotal key={cycle} label={`${CYCLE_LABEL[cycle]}・${count}席`}>
              <SeatAmount usd={usd * count} cycle={cycle} options={options} />
            </SeatTotal>
          ))}
        </dl>
      </div>
    </section>
  )
}

function SeatTotal({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="rounded-xl bg-stone-50 p-4 dark:bg-stone-800/60">
      <dt className="text-sm text-stone-500 dark:text-stone-400">{label}</dt>
      <dd className="mt-1">{children}</dd>
    </div>
  )
}

function SeatAmount({
  usd,
  cycle,
  options,
}: {
  usd: number
  cycle: BillingCycle
  options: PricingOptions | null
}) {
  const total = options && toYen(usd, options).total
  const months = CYCLE_MONTHS[cycle]
  return (
    <>
      <p className="text-2xl font-bold">
        約<Yen value={total} />
        <span className="text-sm font-normal text-stone-500 dark:text-stone-400">
          {' '}
          / {CYCLE_UNIT[cycle]}
        </span>
      </p>
      {months > 1 && (
        <p className="text-sm text-stone-500 dark:text-stone-400">
          1か月あたり 約<Yen value={total === null ? null : total / months} />
        </p>
      )}
    </>
  )
}

function OtherPlans({ currentId }: { currentId: string }) {
  return (
    <nav aria-labelledby="other-plans-heading" className="mt-12">
      <h2 id="other-plans-heading" className="text-sm font-bold text-stone-500 dark:text-stone-400">
        ほかのプランも見る
      </h2>
      <ul className="mt-3 flex flex-wrap gap-2">
        {plans
          .filter((plan) => plan.id !== currentId)
          .map((plan) => (
            <li key={plan.id}>
              <Link
                href={`/plans/${plan.id}`}
                className="inline-block rounded-full border border-stone-300 px-3 py-1.5 text-sm font-medium hover:border-orange-700 hover:text-orange-700 dark:border-stone-700 dark:hover:border-orange-400 dark:hover:text-orange-400"
              >
                {plan.name}
              </Link>
            </li>
          ))}
      </ul>
    </nav>
  )
}
