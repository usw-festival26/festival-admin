import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

const MOCK_USERS = {
  council: { id: 1, name: '총학생회', role: 'council' },
  science: { id: 2, name: '과학생회', role: 'science' },
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('festival-admin-user')
    return saved ? JSON.parse(saved) : null
  })

  const login = (username, password) => {
    // 목업: username으로 역할 결정
    const mockUser = MOCK_USERS[username]
    if (mockUser && password === '1234') {
      setUser(mockUser)
      localStorage.setItem('festival-admin-user', JSON.stringify(mockUser))
      return { success: true }
    }
    return { success: false, message: '아이디 또는 비밀번호가 올바르지 않습니다.' }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('festival-admin-user')
  }

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
