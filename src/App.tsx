import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Booth from './pages/Booth'
import General from './pages/General'
import { ReactNode } from 'react'

function PrivateRoute({ children }: { children: ReactNode }) {
  return <>{children}</>
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Navigate to="/" replace />} />
      <Route path="/" element={<Login />} />
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
