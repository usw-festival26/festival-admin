import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { ROLE_STORAGE_KEY } from './env'

const baseURL = import.meta.env.VITE_API_URL ?? ''

const CSRF_SAFE_METHODS = new Set(['get', 'head', 'options'])

const api = axios.create({
  baseURL,
  timeout: 15000,
  withCredentials: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
})

// axios 내장 xsrf 처리가 cross-origin 환경에서 누락될 가능성에 대비한 fallback.
// document.cookie에서 직접 읽어 X-XSRF-TOKEN을 명시 부착.
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const method = (config.method ?? 'get').toLowerCase()
  if (CSRF_SAFE_METHODS.has(method)) return config
  const match = document.cookie.match(/(?:^|; )XSRF-TOKEN=([^;]*)/)
  if (match) {
    config.headers.set('X-XSRF-TOKEN', decodeURIComponent(match[1]))
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
