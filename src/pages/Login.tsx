import { useState, FormEvent, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [username, setUsername] = useState('')
  const [pw, setPw] = useState('')
  const [error, setError] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    document.body.classList.add('page-login')
    return () => document.body.classList.remove('page-login')
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!username.trim() || !pw.trim()) {
      setError(true)
      return
    }
    try {
      const role = await login(username, pw)
      navigate(role === 'booth' ? '/booth' : '/general', { replace: true })
    } catch {
      setError(true)
    }
  }

  return (
    <Layout>
      <section className="login-container">
        <div className="login-box">
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="button"
              className="login-close"
              aria-label="닫기"
              onClick={() => navigate('/')}
            >
              ×
            </button>
          </div>
          <h1>로그인</h1>
          <p className="login-subtext">로그인 정보를 입력해주세요</p>
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="login-id">
                아이디 <span className="required">*</span>
              </label>
              <input
                id="login-id"
                type="text"
                placeholder="예 : general"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value)
                  if (error) setError(false)
                }}
              />
            </div>
            <div className="form-group">
              <label htmlFor="login-pw">
                비밀번호 <span className="required">*</span>
              </label>
              <input
                id="login-pw"
                type="password"
                placeholder="예 : ••••••"
                value={pw}
                onChange={(e) => {
                  setPw(e.target.value)
                  if (error) setError(false)
                }}
              />
              {error && (
                <div className="login-error" role="alert">
                  아이디 또는 비밀번호가 맞지 않습니다. 다시 확인해주세요.
                </div>
              )}
            </div>
            <div className="login-btn-wrapper">
              <button type="submit" className="login-submit">
                로그인
              </button>
            </div>
          </form>
        </div>
      </section>
    </Layout>
  )
}
