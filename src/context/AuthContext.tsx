import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import api from '../services/api'
import { ROLE_STORAGE_KEY, USE_MOCK } from '../services/env'

type UserRole = 'general' | 'booth' | null

interface LoginResponse {
  role?: string
}

interface AuthContextValue {
  isLoggedIn: boolean
  userRole: UserRole
  login: (loginId: string, password: string) => Promise<UserRole>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

function persistRole(role: Exclude<UserRole, null>) {
  localStorage.setItem(ROLE_STORAGE_KEY, role)
}

function clearPersisted() {
  localStorage.removeItem(ROLE_STORAGE_KEY)
}

function normalizeRole(role: string | undefined): Exclude<UserRole, null> {
  return role === 'booth' ? 'booth' : 'general'
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole>(null)

  useEffect(() => {
    const storedRole = localStorage.getItem(ROLE_STORAGE_KEY) as UserRole
    if (storedRole === 'general' || storedRole === 'booth') {
      setUserRole(storedRole)
    }
  }, [])

  const login = async (loginId: string, password: string): Promise<UserRole> => {
    let role: Exclude<UserRole, null>
    if (USE_MOCK) {
      role = loginId === 'booth' ? 'booth' : 'general'
    } else {
      const res = await api.post<LoginResponse>('/api/admin/auth/login', { loginId, password })
      role = normalizeRole(res.data.role)
    }
    persistRole(role)
    setUserRole(role)
    return role
  }

  const logout = async () => {
    if (!USE_MOCK) {
      try {
        await api.post('/api/admin/auth/logout')
      } catch {
        // ignore — clear local state regardless
      }
    }
    clearPersisted()
    setUserRole(null)
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn: !!userRole, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
