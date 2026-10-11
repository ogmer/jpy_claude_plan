import { isRecord } from './isRecord'

export interface RateProvider {
  name: string
  url: string
}

export interface RateQuote {
  /** 1米ドルあたりの円 */
  rate: number
  provider: RateProvider
  /** レートの基準日時 */
  asOf: Date
  /** asOf が日付単位（時刻を持たない）か */
  dateOnly: boolean
}

interface RateSource {
  provider: RateProvider
  endpoint: string
  parse: (json: unknown) => Omit<RateQuote, 'provider'> | null
}

const TIMEOUT_MS = 8000

const EXCHANGE_RATE_API: RateProvider = {
  name: 'ExchangeRate-API',
  url: 'https://www.exchangerate-api.com',
}

/** 上から順に試し、最初に取得できたレートを使う。どちらも API キー不要で CORS に対応している */
const sources: RateSource[] = [
  {
    provider: EXCHANGE_RATE_API,
    endpoint: 'https://open.er-api.com/v6/latest/USD',
    parse(json) {
      if (!isRecord(json) || json.result !== 'success' || !isRecord(json.rates)) return null
      const rate = json.rates.JPY
      const updated = json.time_last_update_unix
      if (typeof rate !== 'number' || typeof updated !== 'number') return null
      return { rate, asOf: new Date(updated * 1000), dateOnly: false }
    },
  },
  {
    provider: { name: 'Frankfurter（欧州中央銀行）', url: 'https://frankfurter.dev' },
    endpoint: 'https://api.frankfurter.dev/v2/rates?base=USD&quotes=JPY',
    parse(json) {
      const entry: unknown = Array.isArray(json) ? json[0] : undefined
      if (!isRecord(entry) || typeof entry.rate !== 'number' || typeof entry.date !== 'string') {
        return null
      }
      return { rate: entry.rate, asOf: new Date(entry.date), dateOnly: true }
    },
  },
]

/** どの API からも取得できなかったときに使う参考値 */
export const FALLBACK_QUOTE: RateQuote = {
  rate: 158.29,
  provider: EXCHANGE_RATE_API,
  asOf: new Date('2026-10-11T00:02:31Z'),
  dateOnly: true,
}

export const MIN_RATE = 50
export const MAX_RATE = 500

/** 明らかにおかしい値（単位の取り違えなど）を弾く */
export function isPlausibleRate(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= MIN_RATE && value <= MAX_RATE
}

const CACHE_KEY = 'claude-code-jpy:last-quote'

/** 取得できたレートを保存し、次に API が使えないときの代わりにする */
export function saveQuote(quote: RateQuote): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ ...quote, asOf: quote.asOf.toISOString() }))
  } catch {
    // 保存できなくても、表示には影響しない
  }
}

export function loadCachedQuote(): RateQuote | null {
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(CACHE_KEY) ?? 'null')
    if (!isRecord(stored) || !isRecord(stored.provider)) return null
    const { rate, asOf, dateOnly, provider } = stored
    if (!isPlausibleRate(rate) || typeof asOf !== 'string' || typeof dateOnly !== 'boolean') return null
    if (typeof provider.name !== 'string' || typeof provider.url !== 'string') return null
    const date = new Date(asOf)
    if (Number.isNaN(date.getTime())) return null
    return { rate, asOf: date, dateOnly, provider: { name: provider.name, url: provider.url } }
  } catch {
    return null
  }
}

export async function fetchUsdJpy(signal: AbortSignal): Promise<RateQuote> {
  const failures: string[] = []
  for (const source of sources) {
    try {
      const response = await fetch(source.endpoint, {
        signal: AbortSignal.any([signal, AbortSignal.timeout(TIMEOUT_MS)]),
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const parsed = source.parse(await response.json())
      if (!parsed || !isPlausibleRate(parsed.rate)) throw new Error('想定外のレスポンス')
      // 画面に出すのと同じ小数2桁のレートで計算し、利用者が手計算で確かめられるようにする
      return { ...parsed, rate: Math.round(parsed.rate * 100) / 100, provider: source.provider }
    } catch (error) {
      if (signal.aborted) throw error
      failures.push(`${source.provider.name}: ${error instanceof Error ? error.message : String(error)}`)
    }
  }
  throw new Error(`為替レートを取得できませんでした（${failures.join(' / ')}）`)
}
