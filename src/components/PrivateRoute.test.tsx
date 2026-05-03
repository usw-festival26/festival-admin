import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import PrivateRoute from './PrivateRoute'
import { useAuth } from '../context/AuthContext'

vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
}))

const mockedUseAuth = vi.mocked(useAuth)

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/" element={<div>LOGIN</div>} />
        <Route
          path="/booth"
          element={
            <PrivateRoute requiredRole="booth">
              <div>BOOTH</div>
            </PrivateRoute>
          }
        />
        <Route
          path="/general"
          element={
            <PrivateRoute requiredRole="general">
              <div>GENERAL</div>
            </PrivateRoute>
          }
        />
      </Routes>
    </MemoryRouter>,
  )
}

describe('PrivateRoute', () => {
  beforeEach(() => {
    mockedUseAuth.mockReset()
  })

  it('비로그인 상태에서 보호 경로 → / 로 리디렉트', () => {
    mockedUseAuth.mockReturnValue({
      isLoggedIn: false,
      userRole: null,
      login: vi.fn(),
      logout: vi.fn(),
    })
    renderAt('/booth')
    expect(screen.getByText('LOGIN')).not.toBeNull()
  })

  it('역할 불일치 → 본인 역할 경로로 리디렉트', () => {
    mockedUseAuth.mockReturnValue({
      isLoggedIn: true,
      userRole: 'general',
      login: vi.fn(),
      logout: vi.fn(),
    })
    renderAt('/booth')
    expect(screen.getByText('GENERAL')).not.toBeNull()
    expect(screen.queryByText('BOOTH')).toBeNull()
  })

  it('역할 일치 → 자식 렌더', () => {
    mockedUseAuth.mockReturnValue({
      isLoggedIn: true,
      userRole: 'booth',
      login: vi.fn(),
      logout: vi.fn(),
    })
    renderAt('/booth')
    expect(screen.getByText('BOOTH')).not.toBeNull()
  })
})
