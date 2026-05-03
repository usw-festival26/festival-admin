import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ErrorBoundary from './components/ErrorBoundary'
import PrivateRoute from './components/PrivateRoute'
import Login from './pages/Login'
import Booth from './pages/Booth'
import General from './pages/General'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Navigate to="/" replace />} />
      <Route path="/" element={<Login />} />
      <Route
        path="/booth"
        element={
          <PrivateRoute requiredRole="booth">
            <Booth />
          </PrivateRoute>
        }
      />
      <Route
        path="/general"
        element={
          <PrivateRoute requiredRole="general">
            <General />
          </PrivateRoute>
        }
      />
    </Routes>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
