import { Link } from 'react-router-dom'

export default function Sidebar() {
  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <Link to="/" className="logo">
          <img src="/favicon.webp" alt="MIDNIGHT" style={{ width: 80, height: 'auto' }} />
        </Link>
      </div>
    </nav>
  )
}
