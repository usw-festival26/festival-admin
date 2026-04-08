import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Button from '../components/ui/Button'

const QUICK_ACTIONS_COUNCIL = [
  { label: '+ 새 공지 등록', path: '/notice', state: { openModal: 'notice' } },
  { label: '+ 분실물 등록', path: '/lost', state: { openModal: 'lost' } },
]

const QUICK_ACTIONS_SCIENCE = [
  { label: '+ 새 부스 등록', path: '/booth', state: { openModal: 'booth' } },
  { label: '+ 부스 메뉴 등록', path: '/booth', state: { openModal: 'menu' } },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const actions =
    user?.role === 'council'
      ? QUICK_ACTIONS_COUNCIL
      : QUICK_ACTIONS_SCIENCE

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          2026 대동제 관리자
        </h1>
        <p className="text-gray-500">축제 운영을 위한 관리자 페이지입니다.</p>
      </div>

      <div className="flex flex-col-reverse md:flex-row gap-8">
        <div className="flex-1">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            빠른 실행
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {actions.map((action) => (
              <Button
                key={action.label}
                variant="black"
                size="lg"
                className="w-full justify-center"
                onClick={() => navigate(action.path, { state: action.state })}
              >
                {action.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="md:w-80">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-80 flex items-center justify-center">
            <span className="text-gray-400 text-sm">메인 포스터</span>
          </div>
        </div>
      </div>
    </div>
  )
}
