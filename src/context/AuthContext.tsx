import { createContext, useContext, useState, ReactNode } from 'react'

type UserRole = 'general' | 'booth' | null

interface AuthContextValue {
  isLoggedIn: boolean
  userRole: UserRole
  login: (id: string, pw: string) => Promise<UserRole>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState<UserRole>(null)

  const login = async (id: string, _pw: string): Promise<UserRole> => {
    // TODO: 실제 API 연동 (services/api.ts 사용)
    // 임시: 아이디로 역할 구분
    const role: UserRole = id === 'booth' ? 'booth' : 'general'
    setIsLoggedIn(true)
    setUserRole(role)
    return role
  }

  const logout = () => {
    setIsLoggedIn(false)
    setUserRole(null)
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
