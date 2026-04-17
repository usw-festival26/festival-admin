import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProfileIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="프로필">
      <circle cx="17" cy="13" r="6.5" fill="#000" />
      <path d="M3 36c0-7.18 6.268-13 14-13 3.5 0 6.7 1.28 9.1 3.38" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M26.5 27.5l8-8 4 4-8 8-4-4z" fill="#000" />
      <path d="M34.5 19.5l2-2a1.41 1.41 0 0 1 2 2l-2 2-2-2z" fill="#000" />
      <path d="M26.5 31.5l-2.5 1 1-2.5 1.5 1.5z" fill="#000" />
    </svg>
  )
}

export default function TopBar() {
  const { isLoggedIn, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  return (
    <header className="top-bar">
      <div className="top-bar-left">
        <Link to="/" className="topbar-logo">LOGO</Link>
        <div className="search-box">
          <input type="text" placeholder="검색어를 입력해주세요" />
        </div>
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
