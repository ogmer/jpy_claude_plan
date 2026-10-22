import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { JsonLd } from '../../../components/JsonLd'
import { findPlan, plans } from '../../../data/plans'
import { toMetadata } from '../../../lib/metadata'
import { pageMetaFor } from '../../../seo'
import { PlanDetailPage } from '../../../views/PlanDetailPage'

interface Props {
  params: Promise<{ planId: string }>
}

// 定義済みのプラン以外の URL は 404 にする
export const dynamicParams = false

export function generateStaticParams() {
  return plans.map((plan) => ({ planId: plan.id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { planId } = await params
  return toMetadata(pageMetaFor(`/plans/${planId}`))
}

export default async function Page({ params }: Props) {
  const { planId } = await params
  const plan = findPlan(planId)
  if (!plan) notFound()
  return (
    <>
      <JsonLd meta={pageMetaFor(`/plans/${plan.id}`)} />
      <PlanDetailPage plan={plan} />
    </>
  )
}
