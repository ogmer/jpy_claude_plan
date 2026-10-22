import Link from 'next/link'

export function MessagePage({ title, message }: { title: string; message: string }) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="mt-3 text-stone-600 dark:text-stone-400">{message}</p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-xl bg-orange-700 px-5 py-2.5 font-semibold text-white hover:bg-orange-800"
      >
        プラン一覧へ戻る
      </Link>
    </div>
  )
}
