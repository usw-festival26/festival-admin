import { NavLink } from 'react-router-dom'

export default function Sidebar() {
  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <div className="logo">LOGO</div>
      </div>
      <ul className="menu-list">
        <li>
          <NavLink to="/" end className={({ isActive }) => isActive ? 'active-link' : ''}>
            대시보드
          </NavLink>
        </li>
        <li>
          <NavLink to="/general" className={({ isActive }) => isActive ? 'active-link' : ''}>
            총학생회
          </NavLink>
        </li>
        <li>
          <NavLink to="/booth" className={({ isActive }) => isActive ? 'active-link' : ''}>
            과학생회
          </NavLink>
        </li>
      </ul>
    </nav>
  )
}
