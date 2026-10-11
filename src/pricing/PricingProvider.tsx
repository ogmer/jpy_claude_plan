import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import {
  FALLBACK_QUOTE,
  fetchUsdJpy,
  loadCachedQuote,
  saveQuote,
  type RateQuote,
} from '../lib/exchangeRate'
import { PricingContext, type PricingContextValue } from './PricingContext'
import { loadSettings, saveSettings, type Settings } from './settings'

type RateState =
  | { status: 'loading'; quote: null }
  | { status: 'live' | 'fallback'; quote: RateQuote }

/** 開きっぱなしのタブでも、この時間を過ぎて戻ってきたらレートを取り直す */
const REFRESH_AFTER_MS = 60 * 60 * 1000

export function PricingProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState(loadSettings)
  const [rateState, setRateState] = useState<RateState>({ status: 'loading', quote: null })
  const [attempt, setAttempt] = useState(0)
  const fetchedAt = useRef(0)

  useEffect(() => {
    const controller = new AbortController()
    fetchUsdJpy(controller.signal).then(
      (quote) => {
        fetchedAt.current = Date.now()
        saveQuote(quote)
        setRateState({ status: 'live', quote })
      },
      (error: unknown) => {
        if (controller.signal.aborted) return
        console.warn(error)
        // 更新に失敗しても、すでに取得済みのレートは残す。なければ前回保存したレート、最後に参考値
        setRateState((prev) =>
          prev.status === 'live'
            ? prev
            : { status: 'fallback', quote: loadCachedQuote() ?? FALLBACK_QUOTE },
        )
      },
    )
    return () => controller.abort()
  }, [attempt])

  useEffect(() => {
    const refreshIfStale = () => {
      if (document.visibilityState !== 'visible') return
      if (Date.now() - fetchedAt.current > REFRESH_AFTER_MS) setAttempt((n) => n + 1)
    }
    document.addEventListener('visibilitychange', refreshIfStale)
    return () => document.removeEventListener('visibilitychange', refreshIfStale)
  }, [])

  useEffect(() => {
    saveSettings(settings)
  }, [settings])

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...patch }))
  }, [])

  const retry = useCallback(() => {
    setRateState({ status: 'loading', quote: null })
    setAttempt((n) => n + 1)
  }, [])

  const value = useMemo<PricingContextValue>(() => {
    const rate = settings.manualRate ?? rateState.quote?.rate ?? null
    return {
      quote: rateState.quote,
      status: rateState.status,
      settings,
      options:
        rate === null
          ? null
          : { rate, includeTax: settings.includeTax, feePercent: settings.feePercent },
      updateSettings,
      retry,
    }
  }, [settings, rateState, updateSettings, retry])

  return <PricingContext value={value}>{children}</PricingContext>
}
