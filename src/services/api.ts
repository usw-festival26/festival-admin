import axios, { AxiosError } from 'axios'
import { ROLE_STORAGE_KEY } from './env'

const baseURL = import.meta.env.VITE_API_URL ?? ''

const api = axios.create({
  baseURL,
  timeout: 15000,
  withCredentials: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
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
