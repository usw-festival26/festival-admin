import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

type RequiredRole = 'general' | 'booth'

interface Props {
  children: ReactNode
  requiredRole?: RequiredRole
}

export default function PrivateRoute({ children, requiredRole }: Props) {
  const { isLoggedIn, userRole } = useAuth()
  if (!isLoggedIn || !userRole) return <Navigate to="/" replace />
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to={userRole === 'booth' ? '/booth' : '/general'} replace />
  }
  return <>{children}</>
}
