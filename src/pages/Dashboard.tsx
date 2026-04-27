import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { isLoggedIn, logout } = useAuth()

  return (
    <Layout>
      <div className="dashboard-login-link">
        {isLoggedIn ? (
          <button
            type="button"
            onClick={logout}
            style={{ background: 'none', border: 'none', font: 'inherit', cursor: 'pointer', padding: 0 }}
          >
            로그아웃
          </button>
        ) : (
          <Link to="/login">로그인</Link>
        )}
      </div>
      <section className="dashboard-body">
        <div className="hero-section">
          <h1 className="hero-title">
            <span>2026</span> <span>대동제</span> <span>TITLE</span>
          </h1>
          <p>Go ahead and say just a little more about what this is</p>
        </div>
        <div className="content-display">
          <div className="poster-area">
            <div className="poster-placeholder">MAIN POSTER</div>
          </div>
        </div>
      </section>
    </Layout>
  )
}
