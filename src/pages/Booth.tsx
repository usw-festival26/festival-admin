import { FormEvent, useEffect, useState } from 'react'
import Layout from '../components/Layout'
import Modal from '../components/Modal'
import {
  BoothMenu,
  BoothSummary,
  createBooth,
  createBoothMenu,
  getBoothMenu,
  getBooths,
  updateBoothMenu,
} from '../services/booth'

export default function Booth() {
  const [booths, setBooths] = useState<BoothSummary[]>([])
  const [selectedBoothId, setSelectedBoothId] = useState<number | null>(null)
  const [menus, setMenus] = useState<BoothMenu[]>([])

  const [boothModalOpen, setBoothModalOpen] = useState(false)
  const [boothName, setBoothName] = useState('')
  const [boothDesc, setBoothDesc] = useState('')

  const [menuModalOpen, setMenuModalOpen] = useState(false)
  const [menuName, setMenuName] = useState('')
  const [menuPrice, setMenuPrice] = useState('')
  const [menuDesc, setMenuDesc] = useState('')

  const refreshBooths = () => getBooths().then((res) => setBooths(res.data))
  const refreshMenus = (boothId: number) =>
    getBoothMenu(boothId).then((res) => setMenus(res.data))

  useEffect(() => {
    refreshBooths()
  }, [])

  useEffect(() => {
    if (selectedBoothId != null) {
      refreshMenus(selectedBoothId)
    } else {
      setMenus([])
    }
  }, [selectedBoothId])

  const handleBoothSubmit = async (e: FormEvent) => {
    e.preventDefault()
    await createBooth({ name: boothName, description: boothDesc })
    setBoothModalOpen(false)
    setBoothName('')
    setBoothDesc('')
    refreshBooths()
  }

  const handleMenuSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (selectedBoothId == null) {
      window.alert('먼저 부스를 선택해주세요.')
      return
    }
    await createBoothMenu(selectedBoothId, {
      name: menuName,
      price: Number(menuPrice.replace(/[^0-9]/g, '')) || 0,
      description: menuDesc,
      status: '판매 중',
    })
    setMenuModalOpen(false)
    setMenuName('')
    setMenuPrice('')
    setMenuDesc('')
    refreshMenus(selectedBoothId)
  }

  const toggleSoldOut = async (menu: BoothMenu) => {
    if (selectedBoothId == null) return
    const next = menu.status === '품절' ? '판매 중' : '품절'
    await updateBoothMenu(selectedBoothId, menu.menuId, { status: next })
    refreshMenus(selectedBoothId)
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
            <button className="btn-black small" onClick={() => setBoothModalOpen(true)}>
              + 새 부스 등록
            </button>
          </div>

          <div className="booth-table-wrapper">
            <table className="booth-table">
              <thead>
                <tr>
                  <th style={{ width: 60 }}>선택</th>
                  <th>부스 이름</th>
                </tr>
              </thead>
              <tbody>
                {booths.map((booth) => (
                  <tr key={booth.boothId}>
                    <td>
                      <input
                        type="radio"
                        name="selected-booth"
                        checked={selectedBoothId === booth.boothId}
                        onChange={() => setSelectedBoothId(booth.boothId)}
                      />
                    </td>
                    <td>{booth.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selectedBoothId != null && (
            <div className="booth-menu-wrapper">
              <h3>메뉴</h3>
              <div className="grid-container">
                {menus.map((menu) => (
                  <div key={menu.menuId} className="card-item">
                    <div className="card-info">
                      <strong>{menu.name}</strong>
                      <span>{menu.price.toLocaleString()}원</span>
                    </div>
                    <div className="card-action">
                      <span>{menu.status === '품절' ? '품절' : '판매 중'}</span>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={menu.status === '품절'}
                          onChange={() => toggleSoldOut(menu)}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="booth-footer-row">
            <button
              className="btn-outline"
              onClick={() => {
                if (selectedBoothId == null) {
                  window.alert('먼저 부스를 선택해주세요.')
                  return
                }
                setMenuModalOpen(true)
              }}
            >
              부스 메뉴 등록
            </button>
          </div>
        </div>
      </section>

      <Modal
        isOpen={boothModalOpen}
        onClose={() => setBoothModalOpen(false)}
        title="부스 등록"
        description="부스 정보를 입력해주세요."
      >
        <form className="modal-form" onSubmit={handleBoothSubmit}>
          <div className="form-group">
            <label>부스 이름 <span className="required">*</span></label>
            <input
              type="text"
              placeholder="예: 디자인학부 포토부스"
              value={boothName}
              onChange={(e) => setBoothName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>설명 <span className="required">*</span></label>
            <input
              type="text"
              placeholder="부스 설명"
              value={boothDesc}
              onChange={(e) => setBoothDesc(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-black btn-block">등록하기</button>
        </form>
      </Modal>

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
              placeholder="예: 5000"
              value={menuPrice}
              onChange={(e) => setMenuPrice(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>설명</label>
            <input
              type="text"
              placeholder="(선택) 메뉴 설명"
              value={menuDesc}
              onChange={(e) => setMenuDesc(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-black btn-block">등록하기</button>
        </form>
      </Modal>
    </Layout>
  )
}
