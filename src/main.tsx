import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/global.css'
import { USE_MOCK } from './services/env'

if (import.meta.env.PROD && USE_MOCK) {
  console.error('[boot] VITE_USE_MOCK=true in production build — refusing client-trusted login.')
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
