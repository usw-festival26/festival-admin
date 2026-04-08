import { useAuth } from '../../hooks/useAuth'

export default function TopBar({ onMenuToggle }) {
  const { user, logout } = useAuth()

  return (
    <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-5 md:px-10">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="md:hidden text-xl text-gray-600 hover:text-gray-900"
        >
          &#9776;
        </button>
        <div className="hidden sm:block">
          <input
            type="text"
            placeholder="검색어를 입력해주세요"
            className="w-64 px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-700 font-medium">
          {user?.name}님
        </span>
        <button
          onClick={logout}
          className="text-sm text-gray-500 hover:text-red-500 transition-colors"
        >
          로그아웃
        </button>
      </div>
    </header>
  )
}
