import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Booth from './pages/Booth'
import General from './pages/General'
import { ReactNode } from 'react'

function PrivateRoute({ children }: { children: ReactNode }) {
  const { isLoggedIn } = useAuth()
  return isLoggedIn ? <>{children}</> : <Navigate to="/login" replace />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Dashboard />} />
      <Route
        path="/booth"
        element={
          <PrivateRoute>
            <Booth />
          </PrivateRoute>
        }
      />
      <Route
        path="/general"
        element={
          <PrivateRoute>
            <General />
          </PrivateRoute>
        }
      />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
