import { useState, useEffect } from 'react'
import DataTable from '../components/ui/DataTable'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import {
  getLostItems,
  createLostItem,
  toggleCollected,
  deleteLostItem,
} from '../services/lostService'

const COLUMNS = [
  { key: 'id', label: '번호' },
  { key: 'name', label: '물품명' },
  { key: 'description', label: '설명' },
  { key: 'location', label: '발견 장소' },
  {
    key: 'status',
    label: '상태',
    render: (val) => (
      <span
        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
          val === 'collected'
            ? 'bg-green-100 text-green-600'
            : 'bg-yellow-100 text-yellow-600'
        }`}
      >
        {val === 'collected' ? '수거완료' : '대기중'}
      </span>
    ),
  },
  { key: 'createdAt', label: '등록일' },
]

export default function Lost() {
  const [items, setItems] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', location: '' })

  const load = async () => setItems(await getLostItems())

  useEffect(() => { load() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    await createLostItem(form)
    setModalOpen(false)
    setForm({ name: '', description: '', location: '' })
    load()
  }

  const handleToggle = async (id) => {
    await toggleCollected(id)
    load()
  }

  const handleDelete = async (id) => {
    if (!confirm('분실물을 삭제하시겠습니까?')) return
    await deleteLostItem(id)
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">분실물 관리</h1>
        <Button
          variant="primary"
          onClick={() => {
            setForm({ name: '', description: '', location: '' })
            setModalOpen(true)
          }}
        >
          + 분실물 등록
        </Button>
      </div>

      <DataTable
        columns={COLUMNS}
        data={items}
        renderActions={(row) => (
          <div className="flex gap-2">
            <Button variant="edit" size="sm" onClick={() => handleToggle(row.id)}>
              {row.status === 'waiting' ? '수거완료' : '대기로'}
            </Button>
            <Button variant="delete" size="sm" onClick={() => handleDelete(row.id)}>
              삭제
            </Button>
          </div>
        )}
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="분실물 등록"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">물품명</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
              rows={3}
              className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">발견 장소</label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              required
              className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" type="button" onClick={() => setModalOpen(false)}>
              취소
            </Button>
            <Button variant="primary" type="submit">등록</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
