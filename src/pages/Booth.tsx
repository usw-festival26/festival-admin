import { useState } from 'react'
import Layout from '../components/Layout'
import Modal from '../components/Modal'

interface BoothRow {
  id: number
  name: string
  department: string
  info: string
  checked: boolean
}

const initialBooths: BoothRow[] = [
  { id: 1, name: '모여봐요 미대의 숲', department: '디자인학부', info: '음음', checked: true },
  { id: 2, name: '', department: '', info: '', checked: false },
  { id: 3, name: '', department: '', info: '', checked: false },
  { id: 4, name: '', department: '', info: '', checked: false },
]

export default function Booth() {
  const [booths, setBooths] = useState<BoothRow[]>(initialBooths)
  const [menuModalOpen, setMenuModalOpen] = useState(false)
  const [menuName, setMenuName] = useState('')
  const [menuPrice, setMenuPrice] = useState('')

  const toggleCheck = (id: number) => {
    setBooths((prev) =>
      prev.map((b) => (b.id === id ? { ...b, checked: !b.checked } : b))
    )
  }

  const handleMenuSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: services/booth.ts 연동
    setMenuModalOpen(false)
    setMenuName('')
    setMenuPrice('')
  }

  return (
    <Layout>
      <section className="dashboard-body">
        <div className="hero-section">
          <h1>2026 대동제 TITLE</h1>
          <p>Go ahead and say just a little more about what this is</p>
        </div>

        <div className="booth-container">
          <div className="booth-header-row">
            <h2 className="table-title">부스 정보 등록</h2>
            <button className="btn-black small">+ 새 부스 등록</button>
          </div>

          <div className="booth-table-wrapper">
            <table className="booth-table">
              <thead>
                <tr>
                  <th style={{ width: 60 }}>선택</th>
                  <th>부스 이름</th>
                  <th>학부 이름</th>
                  <th>정보</th>
                </tr>
              </thead>
              <tbody>
                {booths.map((booth) => (
                  <tr key={booth.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={booth.checked}
                        onChange={() => toggleCheck(booth.id)}
                      />
                    </td>
                    <td>{booth.name}</td>
                    <td>{booth.department}</td>
                    <td>{booth.info}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="booth-footer-row">
            <button className="btn-outline" onClick={() => setMenuModalOpen(true)}>
              부스 메뉴 등록
            </button>
          </div>
        </div>
      </section>

      <Modal
        isOpen={menuModalOpen}
        onClose={() => setMenuModalOpen(false)}
        title="부스 메뉴 등록"
        description="판매할 메뉴와 가격을 입력해 주세요."
      >
        <form className="modal-form" onSubmit={handleMenuSubmit}>
          <div className="form-group">
            <label>메뉴 이름 <span className="required">*</span></label>
            <input
              type="text"
              placeholder="예: 떡볶이"
              value={menuName}
              onChange={(e) => setMenuName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>가격 <span className="required">*</span></label>
            <input
              type="text"
              placeholder="예: 5,000"
              value={menuPrice}
              onChange={(e) => setMenuPrice(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-black btn-block">등록하기</button>
        </form>
      </Modal>
    </Layout>
  )
}
