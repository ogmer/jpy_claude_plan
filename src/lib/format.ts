const yenFormatter = new Intl.NumberFormat('ja-JP', { maximumFractionDigits: 0 })

const dateFormatter = new Intl.DateTimeFormat('ja-JP', {
  dateStyle: 'medium',
  timeZone: 'Asia/Tokyo',
})

const dateTimeFormatter = new Intl.DateTimeFormat('ja-JP', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'Asia/Tokyo',
})

/** 3,482 のように1円単位で表示する（単位は付けない） */
export function formatYen(value: number): string {
  return yenFormatter.format(Math.round(value))
}

/** $20 や $16.67 のように表示する */
export function formatUsd(value: number): string {
  const digits = Number.isInteger(value) ? 0 : 2
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value)
}

export function formatRate(rate: number): string {
  return rate.toFixed(2)
}

export function formatDate(date: Date): string {
  return dateFormatter.format(date)
}

export function formatDateTime(date: Date): string {
  return dateTimeFormatter.format(date)
}
