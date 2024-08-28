import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import router from './routers/router'
import AuthProvider from './context/AuthProvider'
import CRUDProvider from './context/CRUDProvider'

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <CRUDProvider>
            <RouterProvider router={router} />
          </CRUDProvider>
        </QueryClientProvider>
      </AuthProvider>
  </React.StrictMode>,
)
