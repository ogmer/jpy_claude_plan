import type { BillingCycle, Plan } from '../data/plans'

/** 消費税率。2026年4月1日から Anthropic が日本の利用者に加算している */
export const JCT_RATE = 0.1

export const CYCLE_LABEL: Record<BillingCycle, string> = {
  monthly: '月払い',
  annual: '年払い',
}

export const CYCLE_UNIT: Record<BillingCycle, string> = {
  monthly: '月',
  annual: '年',
}

export const CYCLE_MONTHS: Record<BillingCycle, number> = {
  monthly: 1,
  annual: 12,
}

export interface PricingOptions {
  /** 1米ドルあたりの円 */
  rate: number
  includeTax: boolean
  /** カードの海外事務手数料（%） */
  feePercent: number
}

/** 1回の請求額を円に換算した結果。1円単位に丸める */
export interface YenBreakdown {
  /** 海外事務手数料 */
  fee: number
  /** 手数料を含む支払額 */
  total: number
}

/** 消費税はドル建てで加算され、カード会社が税込のドル額を円に換算する */
export function toYen(usd: number, { rate, includeTax, feePercent }: PricingOptions): YenBreakdown {
  const usdWithTax = includeTax ? usd * (1 + JCT_RATE) : usd
  const converted = Math.round(usdWithTax * rate)
  const fee = Math.round((converted * feePercent) / 100)
  return { fee, total: converted + fee }
}

export interface PriceOption {
  cycle: BillingCycle
  /** 1回の請求額（税抜・米ドル） */
  usd: number
}

export function priceOptions(plan: Plan): PriceOption[] {
  return (['monthly', 'annual'] as const).flatMap((cycle) => {
    const usd = plan.priceUsd[cycle]
    return usd === undefined ? [] : [{ cycle, usd }]
  })
}

/** 希望の支払い方法がないプランでは、用意されている方を返す */
export function pickPriceOption(plan: Plan, preferred: BillingCycle): PriceOption {
  const options = priceOptions(plan)
  return options.find((option) => option.cycle === preferred) ?? options[0]
}
