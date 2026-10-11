import { createBrowserRouter } from 'react-router'
import { AboutPage } from './routes/AboutPage'
import { HomePage } from './routes/HomePage'
import { NotFoundPage } from './routes/NotFoundPage'
import { PlanDetailPage } from './routes/PlanDetailPage'
import { RootLayout } from './routes/RootLayout'
import { RouteErrorPage } from './routes/RouteErrorPage'

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    // レイアウト自体でエラーが起きたとき用
    ErrorBoundary: RouteErrorPage,
    children: [
      {
        // ページ内のエラーは、ヘッダーとフッターを残したまま表示する
        ErrorBoundary: RouteErrorPage,
        children: [
          { index: true, Component: HomePage },
          { path: 'plans/:planId', Component: PlanDetailPage },
          { path: 'about', Component: AboutPage },
          { path: '*', Component: NotFoundPage },
        ],
      },
    ],
  },
])
