import { useState, useEffect } from 'react'
import DataTable from '../components/ui/DataTable'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import { getNotices, createNotice, updateNotice, deleteNotice } from '../services/noticeService'

const COLUMNS = [
  { key: 'id', label: '번호' },
  { key: 'title', label: '제목' },
  { key: 'createdAt', label: '작성일' },
  { key: 'views', label: '조회수' },
]

export default function Notice() {
  const [notices, setNotices] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ title: '', content: '' })

  const load = async () => setNotices(await getNotices())

  useEffect(() => { load() }, [])

  const openCreate = () => {
    setEditing(null)
    setForm({ title: '', content: '' })
    setModalOpen(true)
  }

  const openEdit = (notice) => {
    setEditing(notice)
    setForm({ title: notice.title, content: notice.content })
    setModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editing) {
      await updateNotice(editing.id, form)
    } else {
      await createNotice(form)
    }
    setModalOpen(false)
    load()
  }

  const handleDelete = async (id) => {
    if (!confirm('정말 삭제하시겠습니까?')) return
    await deleteNotice(id)
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">공지사항 관리</h1>
        <Button variant="primary" onClick={openCreate}>
          + 새 공지 등록
        </Button>
      </div>

      <DataTable
        columns={COLUMNS}
        data={notices}
        renderActions={(row) => (
          <div className="flex gap-2">
            <Button variant="edit" size="sm" onClick={() => openEdit(row)}>
              수정
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
        title={editing ? '공지 수정' : '새 공지 등록'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              제목
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              내용
            </label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              required
              rows={5}
              className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" type="button" onClick={() => setModalOpen(false)}>
              취소
            </Button>
            <Button variant="primary" type="submit">
              {editing ? '수정' : '등록'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
