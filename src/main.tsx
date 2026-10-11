import { Analytics } from '@vercel/analytics/react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router/dom'
import { PricingProvider } from './pricing/PricingProvider'
import { router } from './router'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PricingProvider>
      <RouterProvider router={router} />
    </PricingProvider>
    <Analytics />
  </StrictMode>,
)
