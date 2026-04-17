import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { ROLE_STORAGE_KEY, TOKEN_STORAGE_KEY } from './env'

const baseURL = import.meta.env.VITE_API_URL ?? ''

if (!baseURL && import.meta.env.DEV) {
  // eslint-disable-next-line no-console
  console.warn('[api] VITE_API_URL is not set — running in mock mode.')
}

// 백엔드 확정 시 수정: 쿠키/헤더 이름은 서버 규약에 맞춰 변경
const CSRF_COOKIE_NAME = 'XSRF-TOKEN'
const CSRF_HEADER_NAME = 'X-XSRF-TOKEN'
const CSRF_SAFE_METHODS = new Set(['get', 'head', 'options'])

function readCookie(name: string): string | null {
  const match = document.cookie.match(
    new RegExp('(?:^|; )' + name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '=([^;]*)'),
  )
  return match ? decodeURIComponent(match[1]) : null
}

const api = axios.create({
  baseURL,
  timeout: 15000,
  withCredentials: true,
})

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  config.headers.set('Accept', 'application/json')
  const token = localStorage.getItem(TOKEN_STORAGE_KEY)
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`)
  }
  const method = (config.method ?? 'get').toLowerCase()
  if (!CSRF_SAFE_METHODS.has(method)) {
    const csrf = readCookie(CSRF_COOKIE_NAME)
    if (csrf) {
      config.headers.set(CSRF_HEADER_NAME, csrf)
    }
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_STORAGE_KEY)
      localStorage.removeItem(ROLE_STORAGE_KEY)
      const path = window.location.pathname
      if (path !== '/login') {
        window.location.assign('/login')
      }
    }
    return Promise.reject(error)
  },
)

export default api
