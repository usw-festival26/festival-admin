import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { ROLE_STORAGE_KEY, TOKEN_STORAGE_KEY } from './env'

const baseURL = import.meta.env.VITE_API_URL ?? ''

if (!baseURL && import.meta.env.DEV) {
  // eslint-disable-next-line no-console
  console.warn('[api] VITE_API_URL is not set — running in mock mode.')
}

const api = axios.create({
  baseURL,
  timeout: 15000,
})

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  config.headers.set('Accept', 'application/json')
  const token = localStorage.getItem(TOKEN_STORAGE_KEY)
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`)
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
