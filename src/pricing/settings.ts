import { isRecord } from '../lib/isRecord'

export interface Settings {
  includeTax: boolean
  /** カードの海外事務手数料（%） */
  feePercent: number
  /** 手動で指定したレート。null なら自動取得したレートを使う。古い値が残らないよう保存しない */
  manualRate: number | null
}

export const DEFAULT_SETTINGS: Settings = {
  includeTax: true,
  feePercent: 0,
  manualRate: null,
}

export const MAX_FEE_PERCENT = 10

const STORAGE_KEY = 'claude-code-jpy:settings'

export function isValidFeePercent(value: unknown): value is number {
  return (
    typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= MAX_FEE_PERCENT
  )
}

export function loadSettings(): Settings {
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null')
    if (!isRecord(stored)) return DEFAULT_SETTINGS
    return {
      includeTax:
        typeof stored.includeTax === 'boolean' ? stored.includeTax : DEFAULT_SETTINGS.includeTax,
      feePercent: isValidFeePercent(stored.feePercent)
        ? stored.feePercent
        : DEFAULT_SETTINGS.feePercent,
      manualRate: null,
    }
  } catch {
    return DEFAULT_SETTINGS
  }
}

export function saveSettings({ includeTax, feePercent }: Settings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ includeTax, feePercent }))
  } catch {
    // プライベートブラウズなどで保存できなくても、計算はそのまま続けられる
  }
}
