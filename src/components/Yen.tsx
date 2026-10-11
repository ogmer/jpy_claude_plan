import { formatYen } from '../lib/format'

/** レート取得中に金額の代わりに表示する */
export function AmountSkeleton({ className = 'h-[1em] w-[4.5em]' }: { className?: string }) {
  return (
    <span
      className={`inline-block animate-pulse rounded bg-stone-200 align-middle dark:bg-stone-700 ${className}`}
    >
      <span className="sr-only">計算中</span>
    </span>
  )
}

/** 「3,482円」の形で表示する。null の間はスケルトンを出す */
export function Yen({ value }: { value: number | null }) {
  if (value === null) return <AmountSkeleton />
  return <span className="whitespace-nowrap tabular-nums">{formatYen(value)}円</span>
}
