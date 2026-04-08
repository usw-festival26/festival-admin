import { useState, useEffect } from 'react'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import {
  getBooths,
  createBooth,
  deleteBooth,
  addMenu,
  toggleSoldOut,
} from '../services/boothService'

export default function Booth() {
  const [booths, setBooths] = useState([])
  const [boothModalOpen, setBoothModalOpen] = useState(false)
  const [menuModalOpen, setMenuModalOpen] = useState(false)
  const [selectedBooth, setSelectedBooth] = useState(null)
  const [boothForm, setBoothForm] = useState({ name: '', department: '', location: '' })
  const [menuForm, setMenuForm] = useState({ name: '', price: '' })

  const load = async () => setBooths(await getBooths())

  useEffect(() => { load() }, [])

  const handleCreateBooth = async (e) => {
    e.preventDefault()
    await createBooth(boothForm)
    setBoothModalOpen(false)
    setBoothForm({ name: '', department: '', location: '' })
    load()
  }

  const handleDeleteBooth = async (id) => {
    if (!confirm('부스를 삭제하시겠습니까?')) return
    await deleteBooth(id)
    load()
  }

  const openMenuModal = (booth) => {
    setSelectedBooth(booth)
    setMenuForm({ name: '', price: '' })
    setMenuModalOpen(true)
  }

  const handleAddMenu = async (e) => {
    e.preventDefault()
    await addMenu(selectedBooth.id, {
      name: menuForm.name,
      price: Number(menuForm.price),
    })
    setMenuModalOpen(false)
    load()
  }

  const handleToggleSoldOut = async (boothId, menuId) => {
    await toggleSoldOut(boothId, menuId)
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">부스 관리</h1>
        <Button
          variant="primary"
          onClick={() => {
            setBoothForm({ name: '', department: '', location: '' })
            setBoothModalOpen(true)
          }}
        >
          + 새 부스 등록
        </Button>
      </div>

      <div className="space-y-4">
        {booths.length === 0 && (
          <p className="text-center text-gray-400 py-10">등록된 부스가 없습니다.</p>
        )}
        {booths.map((booth) => (
          <div
            key={booth.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-5"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900">{booth.name}</h3>
                <p className="text-sm text-gray-500">
                  {booth.department} &middot; {booth.location}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="primary" size="sm" onClick={() => openMenuModal(booth)}>
                  + 메뉴 추가
                </Button>
                <Button
                  variant="delete"
                  size="sm"
                  onClick={() => handleDeleteBooth(booth.id)}
                >
                  삭제
                </Button>
              </div>
            </div>

            {booth.menus.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[400px] text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-2 text-gray-500 font-medium">메뉴</th>
                      <th className="text-left py-2 text-gray-500 font-medium">가격</th>
                      <th className="text-left py-2 text-gray-500 font-medium">상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    {booth.menus.map((menu) => (
                      <tr key={menu.id} className="border-b border-gray-50">
                        <td className="py-2 text-gray-700">{menu.name}</td>
                        <td className="py-2 text-gray-700">
                          {menu.price.toLocaleString()}원
                        </td>
                        <td className="py-2">
                          <button
                            onClick={() => handleToggleSoldOut(booth.id, menu.id)}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                              menu.soldOut
                                ? 'bg-red-100 text-red-600 hover:bg-red-200'
                                : 'bg-green-100 text-green-600 hover:bg-green-200'
                            }`}
                          >
                            {menu.soldOut ? '품절' : '판매중'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>

      <Modal
        isOpen={boothModalOpen}
        onClose={() => setBoothModalOpen(false)}
        title="새 부스 등록"
      >
        <form onSubmit={handleCreateBooth} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">부스명</label>
            <input
              type="text"
              value={boothForm.name}
              onChange={(e) => setBoothForm({ ...boothForm, name: e.target.value })}
              required
              className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">학과</label>
            <input
              type="text"
              value={boothForm.department}
              onChange={(e) => setBoothForm({ ...boothForm, department: e.target.value })}
              required
              className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">위치</label>
            <input
              type="text"
              value={boothForm.location}
              onChange={(e) => setBoothForm({ ...boothForm, location: e.target.value })}
              required
              className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" type="button" onClick={() => setBoothModalOpen(false)}>
              취소
            </Button>
            <Button variant="primary" type="submit">등록</Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={menuModalOpen}
        onClose={() => setMenuModalOpen(false)}
        title={`메뉴 추가 — ${selectedBooth?.name}`}
      >
        <form onSubmit={handleAddMenu} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">메뉴명</label>
            <input
              type="text"
              value={menuForm.name}
              onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })}
              required
              className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">가격 (원)</label>
            <input
              type="number"
              value={menuForm.price}
              onChange={(e) => setMenuForm({ ...menuForm, price: e.target.value })}
              required
              min="0"
              className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" type="button" onClick={() => setMenuModalOpen(false)}>
              취소
            </Button>
            <Button variant="primary" type="submit">추가</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
