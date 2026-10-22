import Link from 'next/link'

/** 申し込む媒体によって価格が変わることを伝える注記 */
export function PlatformNotice({ withLink = false }: { withLink?: boolean }) {
  return (
    <p
      role="note"
      className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-950 dark:border-amber-800/60 dark:bg-amber-950/30 dark:text-amber-100"
    >
      <strong className="font-semibold">申し込む媒体によって価格が変わります。</strong>
      このサイトの金額は、公式サイト（Web）で申し込んだ場合の目安です。iPhone・iPad の App Store や
      Android の Google Play など、アプリ内課金で申し込むと、各ストアが定める別の価格になります。
      {withLink && (
        <>
          {' '}
          <Link href="/about#platform" className="font-medium underline underline-offset-2">
            詳しく見る
          </Link>
        </>
      )}
    </p>
  )
}
