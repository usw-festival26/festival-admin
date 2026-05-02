import { Link } from 'react-router-dom'

export default function Sidebar() {
  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <Link to="/" className="logo">
          LOGO
        </Link>
      </div>
    </nav>
  )
}
