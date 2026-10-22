'use client'

import { createContext, use } from 'react'
import type { RateQuote } from '../lib/exchangeRate'
import type { PricingOptions } from '../lib/pricing'
import type { Settings } from './settings'

/** live: API から取得済み / fallback: 取得に失敗したため参考値を使用中 */
export type RateStatus = 'loading' | 'live' | 'fallback'

export interface PricingContextValue {
  /** 自動取得したレート。取得中は null */
  quote: RateQuote | null
  status: RateStatus
  settings: Settings
  /** 円換算に使う条件。レートが決まるまでは null */
  options: PricingOptions | null
  updateSettings: (patch: Partial<Settings>) => void
  retry: () => void
}

export const PricingContext = createContext<PricingContextValue | null>(null)

export function usePricing(): PricingContextValue {
  const value = use(PricingContext)
  if (value === null) throw new Error('usePricing は PricingProvider の内側で使ってください')
  return value
}
