import { createContext, useContext, useState, ReactNode } from 'react'
import api from '../services/api'
import { ROLE_STORAGE_KEY, USE_MOCK } from '../services/env'

type UserRole = 'general' | 'booth' | null

interface RoleResponse {
  role: string
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

function readPersistedRole(): UserRole {
  const raw = localStorage.getItem(ROLE_STORAGE_KEY)
  return raw === 'general' || raw === 'booth' ? raw : null
}

function normalizeRole(role: string | undefined): Exclude<UserRole, null> {
  if (!role) throw new Error('역할 정보가 응답에 포함되지 않았습니다.')
  if (role === 'DEPARTMENT_COUNCIL') return 'booth'
  if (role === 'STUDENT_COUNCIL' || role === 'GENERAL_COUNCIL') return 'general'
  throw new Error(`알 수 없는 역할: ${role}`)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // 백엔드에 세션 검증 엔드포인트(/me)가 없으므로 localStorage hint로 초기 역할을 결정.
  // 잘못된 hint(역할 위·변조 포함)는 첫 보호 API 호출 시 401 인터셉터에서 정리됨.
  const [userRole, setUserRole] = useState<UserRole>(readPersistedRole)

  const login = async (loginId: string, password: string): Promise<UserRole> => {
    let role: Exclude<UserRole, null>
    if (USE_MOCK) {
      role = loginId === 'booth' ? 'booth' : 'general'
    } else {
      const res = await api.post<RoleResponse>('/api/admin/auth/login', { loginId, password })
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

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
