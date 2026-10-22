import type { Metadata } from 'next'
import { toMetadata } from '../lib/metadata'
import { notFoundMeta } from '../seo'
import { MessagePage } from '../views/MessagePage'

export const metadata: Metadata = toMetadata(notFoundMeta())

export default function NotFound() {
  return (
    <MessagePage
      title="ページが見つかりません"
      message="URL が間違っているか、ページが移動した可能性があります。"
    />
  )
}
