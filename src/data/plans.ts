export type BillingCycle = 'monthly' | 'annual'

export type PlanGroup = 'individual' | 'team'

export interface SeatRange {
  min: number
  max?: number
}

export interface Plan {
  id: string
  name: string
  group: PlanGroup
  /** どんな人に向いているか */
  summary: string
  /** 利用量の目安（公式サイトの表記にもとづく） */
  usage?: string
  /**
   * 税抜の米ドル価格。monthly は1か月分、annual は1年分の請求額。
   * 席単位のプランは1席あたりの価格。
   */
  priceUsd: Partial<Record<BillingCycle, number>>
  /** 席単位で契約するプランの契約可能な席数 */
  seats?: SeatRange
  /** 席料金とは別に、利用量に応じた従量課金があるか */
  metered?: boolean
  features: string[]
  /** 公式サイトの申し込みページ */
  signup: { label: string; url: string }
}

export const GROUP_LABEL: Record<PlanGroup, string> = {
  individual: '個人向け',
  team: 'チーム・企業向け',
}

const TEAM_SIGNUP = {
  label: 'Team に申し込む',
  url: 'https://claude.ai/upgrade?initialPlanType=team',
}

const MAX_SIGNUP = {
  label: 'Max に申し込む',
  url: 'https://claude.ai/login?plan=max',
}

export const plans: Plan[] = [
  {
    id: 'pro',
    name: 'Pro',
    group: 'individual',
    summary: 'まずは個人で Claude Code を使ってみたい人に',
    priceUsd: { monthly: 20, annual: 200 },
    features: ['Claude Code が使える', '月払い・年払いを選べる'],
    signup: { label: 'Pro に申し込む', url: 'https://claude.ai/login?plan=pro' },
  },
  {
    id: 'max-5x',
    name: 'Max 5x',
    group: 'individual',
    summary: '毎日の開発で Claude Code をしっかり使う人に',
    usage: 'Pro の5倍の利用量',
    priceUsd: { monthly: 100 },
    features: ['Claude Code が使える', '月払いのみ'],
    signup: MAX_SIGNUP,
  },
  {
    id: 'max-20x',
    name: 'Max 20x',
    group: 'individual',
    summary: '長時間・大規模な作業で使い倒したい人に',
    usage: 'Pro の20倍の利用量',
    priceUsd: { monthly: 200 },
    features: ['Claude Code が使える', '月払いのみ'],
    signup: MAX_SIGNUP,
  },
  {
    id: 'team-standard',
    name: 'Team Standard',
    group: 'team',
    summary: 'チームで Claude Code を導入したい組織に',
    usage: 'Pro より多い利用量',
    priceUsd: { monthly: 25, annual: 240 },
    seats: { min: 2, max: 150 },
    features: ['Claude Code が使える', '2〜150名で契約'],
    signup: TEAM_SIGNUP,
  },
  {
    id: 'team-premium',
    name: 'Team Premium',
    group: 'team',
    summary: 'Claude Code をたくさん使うメンバー向けの席',
    usage: 'Standard 席の5倍の利用量',
    priceUsd: { monthly: 125, annual: 1200 },
    seats: { min: 2, max: 150 },
    features: ['Claude Code が使える', '2〜150名で契約'],
    signup: TEAM_SIGNUP,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    group: 'team',
    summary: 'セキュリティや管理機能が必要な大規模組織に',
    usage: '利用分は API 料金で従量課金',
    priceUsd: { annual: 240 },
    seats: { min: 20 },
    metered: true,
    features: [
      'Claude Code が使える',
      'SSO・SCIM・監査ログなどの管理機能',
      '年間契約・最低20席',
    ],
    signup: { label: '営業に問い合わせる', url: 'https://claude.com/contact-sales' },
  },
]

export function findPlan(id: string | undefined): Plan | undefined {
  return plans.find((plan) => plan.id === id)
}

/** カードや詳細ページに箇条書きで出す、プランの特徴 */
export function planHighlights(plan: Plan): string[] {
  return plan.usage ? [plan.usage, ...plan.features] : plan.features
}
