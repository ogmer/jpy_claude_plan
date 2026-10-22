# Claude Code 料金 円換算

Claude Code が使える各プラン（Pro・Max・Team・Enterprise）の料金を、最新のドル円レートで日本円に換算して表示する非公式サイトです。申し込みは、各プランのボタンから公式サイトで行います。

> Anthropic とは関係のない個人制作のサイトです。円の金額は公式サイトのドル価格をもとにした目安で、実際の請求額はカード会社の換算レートで決まります。

## 機能

- **円換算の料金表示**：プランごとに月額・年額を日本円で表示。月払い／年払いの切り替えは URL（`?billing=annual`）に残る
- **為替レートの自動取得**：ページを開くたびに最新のドル円レートを取得。1 時間以上たってからタブに戻ると取り直す
- **計算条件の変更**：消費税 10% の有無、カードの海外事務手数料、レートの手動指定
- **プラン詳細**：料金の内訳表、年払いでの節約額、席数での計算（Team・Enterprise）
- **公式サイトへの誘導**：各プランから公式の申し込みページへリンク
- **媒体による価格差の注記**：App Store / Google Play のアプリ内課金は別価格になることを明記
- **SEO 対応**：ページごとの title・description・OGP・構造化データ、sitemap.xml、robots.txt

## 技術構成

| 用途 | 使っているもの |
|---|---|
| フレームワーク | Next.js 16（App Router） |
| UI | React 19 + TypeScript |
| アクセス解析 | Vercel Web Analytics（`@vercel/analytics/next`） |
| スタイル | Tailwind CSS 4 |
| 為替レート | [ExchangeRate-API](https://www.exchangerate-api.com)（失敗時は [Frankfurter](https://frankfurter.dev)） |

Node.js 20.9 以上が必要です（Next.js 16 の要件）。

## 開発

```bash
npm install
npm run dev      # 開発サーバー (http://localhost:3000)
npm run lint     # ESLint
npm run build    # 型チェック + 本番ビルド
npm run start    # ビルド結果の確認
```

## ディレクトリ構成

```
src/
├── config.ts            サイト名・料金の確認日・公式ページの URL
├── data/plans.ts        プランの料金・特徴・申し込み先（料金改定はここを編集）
├── seo.ts               ページごとの title / description / 構造化データ
├── app/                 ルーティング（layout・各ページ・404・sitemap・robots）
├── lib/
│   ├── pricing.ts       円換算・消費税・手数料の計算
│   ├── exchangeRate.ts  為替 API の取得とキャッシュ
│   ├── format.ts        金額・日時の表示形式
│   ├── metadata.ts      PageMeta を Next.js の Metadata に変換
│   └── siteUrl.ts       サイトの URL（SITE_URL）の取得
├── pricing/             為替レートと計算条件の Context
├── components/          共通コンポーネント
└── views/               ページの中身（一覧・詳細・計算方法・メッセージ）
```

## 料金を更新するとき

公式サイトで料金が改定されたら、[src/data/plans.ts](src/data/plans.ts) の `priceUsd`（税抜のドル価格。`annual` は年額）を編集します。

公式の料金ページ：<https://claude.com/pricing>（[Team](https://claude.com/pricing/team) / [Enterprise](https://claude.com/pricing/enterprise)）

## 為替レートの扱い

1. ExchangeRate-API から取得（1 日 1 回更新、API キー不要）
2. 失敗したら Frankfurter から取得
3. どちらも失敗したら、前回取得してブラウザに保存したレート
4. 保存もなければ、[src/lib/exchangeRate.ts](src/lib/exchangeRate.ts) の `FALLBACK_QUOTE`（参考値）

どの場合も、使っているレートの基準日時を画面上部に表示します。

## 本番ビルドと公開

```bash
npm run build
npm run start
```

ページは `next build` のときに静的な HTML として生成されます（title・description・canonical・OGP・構造化データ入り）。存在しない URL は 404（`noindex`）になり、`/sitemap.xml` と `/robots.txt` も自動で配信されます。

- **サイトの URL** は、環境変数 `SITE_URL` で指定します（例: `https://your-domain.example`）。未指定の場合は Vercel が渡す `VERCEL_PROJECT_PRODUCTION_URL` を使い、どちらもなければ canonical・`og:url`・構造化データ・`sitemap.xml` は作りません。
- **Vercel にデプロイする**場合は、プロジェクトの Framework Preset を **Next.js** にしてください（Vite のままだと `dist` を探して失敗します）。Web Analytics は、Vercel のプロジェクトで有効化して再デプロイすると計測が始まります。

## 注意事項

- 料金・消費税の扱いは公式サイトで確認した内容です。
- アプリ内課金（iPhone・iPad・Android）の価格は、このサイトの金額と一致しないことがあります。
- 日本の利用者には、2026 年 4 月 1 日から 10% の消費税（JCT）が加算されています（[公式のお知らせ](https://support.claude.com/ja/articles/14051822)）。
