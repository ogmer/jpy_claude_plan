'use client'

import { useId, useState, type ReactNode } from 'react'
import { JCT_NOTICE_URL } from '../config'
import { MAX_RATE, MIN_RATE, isPlausibleRate, type RateQuote } from '../lib/exchangeRate'
import { formatDate, formatDateTime, formatRate } from '../lib/format'
import { usePricing } from '../pricing/PricingContext'
import { MAX_FEE_PERCENT, isValidFeePercent } from '../pricing/settings'
import { OfficialLink } from './OfficialLink'
import { AmountSkeleton } from './Yen'

/** 全ページ共通の、為替レートと計算条件を表示・変更するバー */
export function RateBar() {
  const { settings, updateSettings } = usePricing()
  const [open, setOpen] = useState(false)
  const panelId = useId()

  return (
    <section
      aria-label="為替レートと計算条件"
      className="border-b border-stone-200 bg-stone-100/70 dark:border-stone-800 dark:bg-stone-900/60"
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 py-3 text-sm">
        <RateSummary
          onResetManualRate={() => {
            updateSettings({ manualRate: null })
            setOpen(false)
          }}
        />
        <div className="flex flex-wrap items-center gap-2">
          <Chip>{settings.includeTax ? '消費税10%込み' : '税抜'}</Chip>
          {settings.feePercent > 0 && <Chip>手数料 {settings.feePercent}%</Chip>}
          <button
            type="button"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((prev) => !prev)}
            className="rounded-lg border border-stone-300 bg-white px-3 py-1.5 font-medium hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-800 dark:hover:bg-stone-700"
          >
            計算条件を変更
          </button>
        </div>
      </div>
      {open && <SettingsPanel id={panelId} />}
    </section>
  )
}

function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-stone-600 ring-1 ring-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:ring-stone-700">
      {children}
    </span>
  )
}

function formatAsOf(quote: RateQuote): string {
  return quote.dateOnly ? formatDate(quote.asOf) : formatDateTime(quote.asOf)
}

function RateSummary({ onResetManualRate }: { onResetManualRate: () => void }) {
  const { quote, status, settings, retry } = usePricing()

  let detail: ReactNode
  if (settings.manualRate !== null) {
    detail = (
      <>
        手動で指定したレートで計算しています。
        <button type="button" onClick={onResetManualRate} className="ml-1 font-medium underline">
          自動取得に戻す
        </button>
      </>
    )
  } else if (status === 'loading' || quote === null) {
    detail = '最新のレートを取得しています…'
  } else if (status === 'fallback') {
    detail = (
      <>
        最新のレートを取得できなかったため、{formatAsOf(quote)}時点のレートで計算しています。
        <button type="button" onClick={retry} className="ml-1 font-medium underline">
          再取得
        </button>
      </>
    )
  } else {
    detail = (
      <>
        <a
          href={quote.provider.url}
          target="_blank"
          rel="noopener noreferrer"
          className="underline-offset-2 hover:underline"
        >
          {quote.provider.name}
        </a>
        ・{formatAsOf(quote)}時点
      </>
    )
  }

  const rate = settings.manualRate ?? quote?.rate ?? null

  return (
    <div aria-live="polite" className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
      <p className="text-base font-semibold">
        1ドル ={' '}
        {rate === null ? (
          <AmountSkeleton className="h-[1em] w-[3.5em]" />
        ) : (
          <span className="tabular-nums">{formatRate(rate)}</span>
        )}
        円
      </p>
      <p
        className={
          status === 'fallback' && settings.manualRate === null
            ? 'text-amber-800 dark:text-amber-300'
            : 'text-stone-500 dark:text-stone-400'
        }
      >
        {detail}
      </p>
    </div>
  )
}

/** 入力中の文字列を数値にする。空欄は null */
function parseInput(text: string): number | null {
  return text.trim() === '' ? null : Number(text)
}

const inputClass =
  'w-28 rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-right tabular-nums aria-invalid:border-red-600 dark:border-stone-700 dark:bg-stone-800'

function SettingsPanel({ id }: { id: string }) {
  const { quote, settings, updateSettings } = usePricing()
  const [feeText, setFeeText] = useState(settings.feePercent === 0 ? '' : String(settings.feePercent))
  const [rateText, setRateText] = useState(
    settings.manualRate === null ? '' : String(settings.manualRate),
  )
  const feeId = useId()
  const rateId = useId()

  const fee = parseInput(feeText)
  const feeInvalid = fee !== null && !isValidFeePercent(fee)
  const manualRate = parseInput(rateText)
  const rateInvalid = manualRate !== null && !isPlausibleRate(manualRate)

  return (
    <div id={id} className="border-t border-stone-200 dark:border-stone-800">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-5 text-sm sm:grid-cols-3">
        <div>
          <label className="flex items-center gap-2 font-medium">
            <input
              type="checkbox"
              checked={settings.includeTax}
              onChange={(e) => updateSettings({ includeTax: e.target.checked })}
              className="size-4 accent-orange-700"
            />
            消費税（10%）を含める
          </label>
          <p className="mt-1.5 text-stone-500 dark:text-stone-400">
            2026年4月1日から、日本の利用者には10%の消費税が加算されています。
            <OfficialLink href={JCT_NOTICE_URL}>公式のお知らせ</OfficialLink>
          </p>
        </div>

        <div>
          <label htmlFor={feeId} className="font-medium">
            カードの海外事務手数料
          </label>
          <div className="mt-1.5 flex items-center gap-2">
            <input
              id={feeId}
              type="number"
              inputMode="decimal"
              min={0}
              max={MAX_FEE_PERCENT}
              step={0.01}
              placeholder="0"
              value={feeText}
              aria-invalid={feeInvalid}
              onChange={(e) => {
                const text = e.target.value
                setFeeText(text)
                const value = parseInput(text) ?? 0
                if (isValidFeePercent(value)) updateSettings({ feePercent: value })
              }}
              className={inputClass}
            />
            %
          </div>
          <p className="mt-1.5 text-stone-500 dark:text-stone-400">
            {feeInvalid
              ? `0〜${MAX_FEE_PERCENT}の範囲で入力してください。`
              : 'ドル建ての支払いでカード会社が上乗せする手数料です。率はカード会社によって異なります。'}
          </p>
        </div>

        <div>
          <label htmlFor={rateId} className="font-medium">
            レートを手動で指定
          </label>
          <div className="mt-1.5 flex items-center gap-2">
            1ドル =
            <input
              id={rateId}
              type="number"
              inputMode="decimal"
              min={MIN_RATE}
              max={MAX_RATE}
              step={0.01}
              placeholder={quote ? formatRate(quote.rate) : ''}
              value={rateText}
              aria-invalid={rateInvalid}
              onChange={(e) => {
                const text = e.target.value
                setRateText(text)
                const value = parseInput(text)
                if (value === null) updateSettings({ manualRate: null })
                else if (isPlausibleRate(value)) updateSettings({ manualRate: value })
              }}
              className={inputClass}
            />
            円
          </div>
          <p className="mt-1.5 text-stone-500 dark:text-stone-400">
            {rateInvalid
              ? `${MIN_RATE}〜${MAX_RATE}の範囲で入力してください。`
              : '空欄なら自動取得したレートを使います。カード会社の換算レートが分かるときに入力してください。'}
          </p>
        </div>
      </div>
    </div>
  )
}
