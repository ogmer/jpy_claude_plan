import type { ReactNode } from 'react'
import { OfficialLink } from '../components/OfficialLink'
import { Seo } from '../components/Seo'
import { JCT_NOTICE_URL, OFFICIAL_PRICING_URL, PRICES_CHECKED_AT } from '../config'
import { ABOUT_META } from '../seo'

export function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <Seo meta={ABOUT_META} />

      <h1 className="text-3xl font-bold tracking-tight">計算方法と注意事項</h1>

      <Section title="円の金額の計算方法">
        <p className="rounded-xl bg-white p-4 font-medium ring-1 ring-stone-200 dark:bg-stone-900 dark:ring-stone-800">
          支払額の目安 ＝ ドル価格（税抜）×（1＋消費税10%）× ドル円レート ×（1＋海外事務手数料）
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>消費税と海外事務手数料は、画面上部の「計算条件を変更」から外せます。</li>
          <li>年払いの「1か月あたり」は、年額を12で割った金額です。</li>
          <li>円の金額は1円未満を四捨五入しています。</li>
        </ul>
      </Section>

      <Section title="為替レート">
        <p>
          ページを開くたびに、ExchangeRate-API が公開しているその日のドル円レート（1日1回更新）を取得して計算します。開いたままのタブも、1時間以上たってから戻ってくると自動で取り直します。
        </p>
        <p>
          取得できないときは Frankfurter（欧州中央銀行の参照レート）を使います。それも取得できない場合は、前回取得できたレート、それもなければ
          {PRICES_CHECKED_AT}時点の参考値で計算し、画面上部にその旨を表示します。
        </p>
        <p>
          実際の請求額は、カード会社が決済を処理した日のレートで決まります。カード会社のレートが分かる場合は、「計算条件を変更」から手動で指定できます。
        </p>
      </Section>

      <Section title="消費税">
        <p>
          2026年4月1日から、Anthropic
          は日本の利用者に10%の消費税（JCT）を加算しています。請求は引き続きドル建てです。
          <OfficialLink href={JCT_NOTICE_URL}>公式のお知らせ</OfficialLink>
        </p>
      </Section>

      <Section title="カードの海外事務手数料">
        <p>
          ドル建ての支払いでは、多くのカード会社が換算レートに手数料を上乗せします。率はカード会社や国際ブランドによって異なるため、お使いのカードの案内を確認して「計算条件を変更」から入力してください。
        </p>
      </Section>

      <Section id="platform" title="申し込む媒体による価格の違い">
        <p>
          このサイトの金額は、公式サイト（Web）でドル建てのまま申し込んだ場合の目安です。
          申し込む媒体によっては、同じプランでも価格が変わります。
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>Web（claude.ai）</strong>
            ：公式サイトの価格表どおりのドル建てです。このサイトの計算はこちらを前提にしています。
          </li>
          <li>
            <strong>iPhone・iPad（App Store）／ Android（Google Play）</strong>
            ：アプリ内課金では、各ストアが定める価格と税の扱いになります。金額はこのサイトの表示と一致しないことがあります。
          </li>
        </ul>
        <p>
          正確な金額は、申し込み画面に表示される価格で確認してください。
        </p>
      </Section>

      <Section title="料金の出典">
        <p>
          プランの料金は{PRICES_CHECKED_AT}
          に公式サイトで確認したものです。料金が改定されている場合があるため、申し込み前に必ず公式サイトで確認してください。
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <OfficialLink href={OFFICIAL_PRICING_URL}>料金プラン（Pro・Max）</OfficialLink>
          </li>
          <li>
            <OfficialLink href="https://claude.com/pricing/team">Team プラン</OfficialLink>
          </li>
          <li>
            <OfficialLink href="https://claude.com/pricing/enterprise">Enterprise プラン</OfficialLink>
          </li>
        </ul>
      </Section>
    </div>
  )
}

function Section({ id, title, children }: { id?: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="mt-10 scroll-mt-6">
      <h2 className="text-lg font-bold">{title}</h2>
      <div className="mt-3 space-y-3 leading-relaxed text-stone-700 dark:text-stone-300">
        {children}
      </div>
    </section>
  )
}
