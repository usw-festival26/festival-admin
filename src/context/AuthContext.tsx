import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import api from '../services/api'
import { ROLE_STORAGE_KEY, TOKEN_STORAGE_KEY, USE_MOCK } from '../services/env'

type UserRole = 'general' | 'booth' | null

interface LoginResponse {
  username: string
  access_token: string
  token_type: string
  role: Exclude<UserRole, null>
  message?: string
}

interface AuthContextValue {
  isLoggedIn: boolean
  userRole: UserRole
  login: (username: string, password: string) => Promise<UserRole>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function persist(token: string, role: Exclude<UserRole, null>) {
  localStorage.setItem(TOKEN_STORAGE_KEY, token)
  localStorage.setItem(ROLE_STORAGE_KEY, role)
}

function clearPersisted() {
  localStorage.removeItem(TOKEN_STORAGE_KEY)
  localStorage.removeItem(ROLE_STORAGE_KEY)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [userRole, setUserRole] = useState<UserRole>(null)

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY)
    const storedRole = localStorage.getItem(ROLE_STORAGE_KEY) as UserRole
    if (storedToken && (storedRole === 'general' || storedRole === 'booth')) {
      setToken(storedToken)
      setUserRole(storedRole)
    }
  }, [])

  const login = async (username: string, password: string): Promise<UserRole> => {
    let role: Exclude<UserRole, null>
    let accessToken: string

    if (USE_MOCK) {
      role = username === 'booth' ? 'booth' : 'general'
      accessToken = `mock-token-${Date.now()}`
    } else {
      const res = await api.post<LoginResponse>('/api/auth/login', { username, password })
      role = res.data.role
      accessToken = res.data.access_token
    }

    persist(accessToken, role)
    setToken(accessToken)
    setUserRole(role)
    return role
  }

  const logout = () => {
    if (!USE_MOCK) {
      api.post('/api/auth/logout').catch(() => {})
    }
    clearPersisted()
    setToken(null)
    setUserRole(null)
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn: !!token, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
