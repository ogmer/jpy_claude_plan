'use client'

import { useEffect } from 'react'
import { MessagePage } from '../views/MessagePage'

export default function ErrorPage({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    console.error(error)
  }, [error])
  return (
    <MessagePage
      title="ページを表示できませんでした"
      message="時間をおいて、ページを再読み込みしてください。"
    />
  )
}
