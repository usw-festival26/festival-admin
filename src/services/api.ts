import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { ROLE_STORAGE_KEY } from './env'

const baseURL = import.meta.env.VITE_API_URL ?? ''

if (!baseURL && import.meta.env.DEV) {
  // eslint-disable-next-line no-console
  console.warn('[api] VITE_API_URL is not set — running in mock mode.')
}

const CSRF_REQUEST_HEADER = 'X-XSRF-TOKEN'
const CSRF_RESPONSE_HEADERS = ['x-xsrf-token', 'x-csrf-token']
const CSRF_COOKIE_NAME = 'XSRF-TOKEN'
const CSRF_STORAGE_KEY = 'festival_admin_csrf'
const CSRF_SAFE_METHODS = new Set(['get', 'head', 'options'])

function readCookie(name: string): string | null {
  const match = document.cookie.match(
    new RegExp('(?:^|; )' + name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '=([^;]*)'),
  )
  return match ? decodeURIComponent(match[1]) : null
}

let csrfToken: string | null = null

export function getCsrfToken(): string | null {
  if (csrfToken) return csrfToken
  const stored = localStorage.getItem(CSRF_STORAGE_KEY)
  if (stored) {
    csrfToken = stored
    return stored
  }
  return readCookie(CSRF_COOKIE_NAME)
}

export function setCsrfToken(token: string | null): void {
  csrfToken = token
  if (token) {
    localStorage.setItem(CSRF_STORAGE_KEY, token)
  } else {
    localStorage.removeItem(CSRF_STORAGE_KEY)
  }
}

const api = axios.create({
  baseURL,
  timeout: 15000,
  withCredentials: true,
})

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  config.headers.set('Accept', 'application/json')
  const method = (config.method ?? 'get').toLowerCase()
  if (!CSRF_SAFE_METHODS.has(method)) {
    const token = getCsrfToken()
    if (token) {
      config.headers.set(CSRF_REQUEST_HEADER, token)
    }
  }
  return config
})

function captureCsrfFromResponse(res: AxiosResponse): void {
  for (const headerName of CSRF_RESPONSE_HEADERS) {
    const value = res.headers[headerName]
    if (typeof value === 'string' && value.length > 0) {
      setCsrfToken(value)
      return
    }
  }
}

api.interceptors.response.use(
  (res) => {
    captureCsrfFromResponse(res)
    return res
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(ROLE_STORAGE_KEY)
      setCsrfToken(null)
      const path = window.location.pathname
      if (path !== '/login') {
        window.location.assign('/login')
      }
    }
    return Promise.reject(error)
  },
)

export default api
