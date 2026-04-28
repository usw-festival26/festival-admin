import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProfileIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="프로필">
      <circle cx="20" cy="20" r="19" stroke="#000" strokeWidth="2" />
      <circle cx="20" cy="15" r="6" fill="#000" />
      <path d="M6 34c0-7.18 6.268-12 14-12s14 4.82 14 12" stroke="#000" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export default function TopBar() {
  const { isLoggedIn, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="top-bar">
      <div className="top-bar-left">
        <Link to="/" className="topbar-logo">LOGO</Link>
      </div>
      <div className="top-bar-right">
        {isLoggedIn ? (
          <button type="button" className="topbar-auth" onClick={handleLogout}>
            <span className="profile-icon"><ProfileIcon /></span>
            <span>로그아웃</span>
          </button>
        ) : (
          <Link to="/" className="topbar-auth">
            <span className="profile-icon"><ProfileIcon /></span>
            <span>로그인</span>
          </Link>
        )}
      </div>
    </header>
  )
}
