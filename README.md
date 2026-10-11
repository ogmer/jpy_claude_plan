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
| ビルド | Vite 8 |
| UI | React 19 + TypeScript |
| ルーティング | React Router 8（Data Mode / `createBrowserRouter`） |
| スタイル | Tailwind CSS 4 |
| 為替レート | [ExchangeRate-API](https://www.exchangerate-api.com)（失敗時は [Frankfurter](https://frankfurter.dev)） |

Node.js 22.22 以上が必要です（React Router 8 の要件）。

## 開発

```bash
npm install
npm run dev      # 開発サーバー (http://localhost:5173)
npm run lint     # ESLint
npm run build    # 型チェック + 本番ビルド + SEO 用ファイルの生成
npm run preview  # ビルド結果の確認
```

## ディレクトリ構成

```
src/
├── config.ts            サイト名・料金の確認日・公式ページの URL
├── data/plans.ts        プランの料金・特徴・申し込み先（料金改定はここを編集）
├── seo.ts               ページごとの title / description（ビルド時にも使う）
├── router.ts            ルーティング定義
├── lib/
│   ├── pricing.ts       円換算・消費税・手数料の計算
│   ├── exchangeRate.ts  為替 API の取得とキャッシュ
│   ├── format.ts        金額・日時の表示形式
│   └── head.ts          画面遷移時の <head> 更新
├── pricing/             為替レートと計算条件の Context
├── components/          共通コンポーネント
└── routes/              ページ（一覧・詳細・計算方法・404）
scripts/postbuild.mjs    ビルド後に各ページの HTML・sitemap・robots.txt を生成
```

## 料金を更新するとき

公式サイトで料金が改定されたら、次の 2 か所を編集します。

1. [src/data/plans.ts](src/data/plans.ts) の `priceUsd`（税抜のドル価格。`annual` は年額）
2. [src/config.ts](src/config.ts) の `PRICES_CHECKED_AT`（確認した日）

公式の料金ページ：<https://claude.com/pricing>（[Team](https://claude.com/pricing/team) / [Enterprise](https://claude.com/pricing/enterprise)）

## 為替レートの扱い

1. ExchangeRate-API から取得（1 日 1 回更新、API キー不要）
2. 失敗したら Frankfurter から取得
3. どちらも失敗したら、前回取得してブラウザに保存したレート
4. 保存もなければ、[src/lib/exchangeRate.ts](src/lib/exchangeRate.ts) の `FALLBACK_QUOTE`（参考値）

どの場合も、使っているレートの基準日時を画面上部に表示します。

## 本番ビルドと公開

```bash
SITE_URL=https://your-domain.example npm run build
```

PowerShell の場合：

```powershell
$env:SITE_URL = "https://your-domain.example"; npm run build
```

`dist/` に次のファイルができます。

| ファイル | 内容 |
|---|---|
| `index.html`、`plans/*/index.html`、`about/index.html` | ページごとの HTML（title・description・canonical・OGP・構造化データ入り） |
| `404.html` | 存在しないパス用（`noindex`） |
| `sitemap.xml`、`robots.txt` | 検索エンジン向け |

- **`SITE_URL`** は公開するサイトの URL です。canonical・`og:url`・構造化データ・`sitemap.xml` に必要で、指定しない場合はこれらを作りません（警告を表示します）。
- ページごとに `index.html` を書き出すため、静的ホスティング（Netlify、Cloudflare Pages、GitHub Pages、Vercel など）にそのまま置けます。`404.html` は多くのホスティングが自動で使います。
- ホスティングによっては、`/plans/pro` のようなパスを `index.html` に返す設定（SPA フォールバック）があると、より確実です。

## 注意事項

- 料金・消費税の扱いは 2026 年 10 月 11 日に公式サイトで確認した内容です。
- アプリ内課金（iPhone・iPad・Android）の価格は、このサイトの金額と一致しないことがあります。
- 日本の利用者には、2026 年 4 月 1 日から 10% の消費税（JCT）が加算されています（[公式のお知らせ](https://support.claude.com/ja/articles/14051822)）。
