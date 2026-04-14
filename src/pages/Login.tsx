import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [id, setId] = useState('')
  const [pw, setPw] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const role = await login(id, pw)
    navigate(role === 'booth' ? '/booth' : '/general', { replace: true })
  }

  return (
    <div className="admin-wrapper">
      <nav className="sidebar">
        <div className="sidebar-header">
          <div className="logo">LOGO</div>
        </div>
      </nav>
      <main className="main-content">
        <header className="top-bar">
          <div className="top-bar-left">
            <div className="search-box">
              <input type="text" placeholder="검색어를 입력해주세요" />
            </div>
          </div>
          <div className="top-bar-right">
            <div className="profile-icon">👤</div>
          </div>
        </header>
        <section className="login-container">
          <div className="login-box">
            <h1>로그인</h1>
            <p className="login-subtext">로그인 정보를 입력해주세요</p>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>아이디 <span className="required">*</span></label>
                <input
                  type="text"
                  placeholder="아이디를 입력해주세요"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>비밀번호 <span className="required">*</span></label>
                <input
                  type="password"
                  placeholder="비밀번호를 입력해주세요"
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  required
                />
              </div>
              <div className="login-btn-wrapper">
                <button type="submit" className="btn-black">로그인</button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  )
}
