import { NavLink } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const MENU_ITEMS = [
  { path: '/', label: '대시보드', roles: ['council', 'science'] },
  { path: '/notice', label: '공지사항', roles: ['council'] },
  { path: '/booth', label: '부스 관리', roles: ['science'] },
  { path: '/lost', label: '분실물', roles: ['council'] },
]

export default function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth()

  const visibleItems = MENU_ITEMS.filter((item) =>
    item.roles.includes(user?.role)
  )

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      <nav
        className={`
          fixed top-0 left-0 h-full w-64 bg-gray-100 border-r border-gray-200 z-50
          transform transition-transform duration-200 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static md:z-auto
        `}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <span className="text-lg font-bold tracking-tight">2026 대동제</span>
          <button
            onClick={onClose}
            className="md:hidden text-2xl text-gray-500 hover:text-gray-800"
          >
            &times;
          </button>
        </div>
        <ul className="mt-2">
          {visibleItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === '/'}
                onClick={onClose}
                className={({ isActive }) =>
                  `block px-6 py-3 text-sm transition-colors ${
                    isActive
                      ? 'bg-white font-semibold text-gray-900 border-r-2 border-blue-500'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </>
  )
}
