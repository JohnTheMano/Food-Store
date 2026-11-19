
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'

import App from '@/App'
import { AuthSessionInitializer, useAuthStore } from '@/features/auth'
import Toast from '@/shared/components/Toast'
import queryClient from '@/shared/api/queryClient'
import { setUnauthorizedHandler } from '@/shared/api/axiosInstance'
import '@/shared/api/setupInterceptors'
import './index.css'

setUnauthorizedHandler(() => useAuthStore.getState().clearSession())

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthSessionInitializer />
      <BrowserRouter>
        <App />
      </BrowserRouter>
      <Toast />
    </QueryClientProvider>
  </StrictMode>,
)
