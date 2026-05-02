import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { ROLE_STORAGE_KEY } from './env'

const baseURL = import.meta.env.VITE_API_URL ?? ''

if (!baseURL && import.meta.env.DEV) {
  // eslint-disable-next-line no-console
  console.info('[api] VITE_API_URL is empty — using same-origin requests (dev proxy 경로).')
}

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
  const method = (config.method ?? 'get').toLowerCase()
  if (!CSRF_SAFE_METHODS.has(method)) {
    const token = readCookie(CSRF_COOKIE_NAME)
    if (token) {
      config.headers.set(CSRF_HEADER_NAME, token)
    }
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    // 401만 세션 만료로 간주해 로그인으로 보낸다.
    // 403은 CSRF 토큰 불일치·권한 부족 등 세션과 무관한 원인이 많아
    // 호출부 catch에서 인라인 에러로 처리하도록 그대로 전달한다.
    if (error.response?.status === 401) {
      localStorage.removeItem(ROLE_STORAGE_KEY)
      const path = window.location.pathname
      if (path !== '/login' && path !== '/') {
        window.location.assign('/')
      }
    }
    return Promise.reject(error)
  },
)

export default api
