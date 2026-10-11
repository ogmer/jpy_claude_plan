import { isRouteErrorResponse, useRouteError } from 'react-router'
import { MessagePage, NotFoundPage } from './NotFoundPage'

export function RouteErrorPage() {
  const error = useRouteError()
  if (isRouteErrorResponse(error) && error.status === 404) return <NotFoundPage />
  console.error(error)
  return (
    <MessagePage
      title="ページを表示できませんでした"
      message="時間をおいて、ページを再読み込みしてください。"
    />
  )
}
