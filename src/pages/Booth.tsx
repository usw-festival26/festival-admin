import { FormEvent, useEffect, useState } from 'react'
import Layout from '../components/Layout'
import Modal from '../components/Modal'
import {
  BoothMenu,
  BoothSummary,
  createBooth,
  createBoothMenu,
  deleteBoothMenu,
  getBoothMenu,
  getBooths,
  updateBoothMenuStatus,
} from '../services/booth'
import { UploadedImage, removeImage, uploadImage } from '../services/supabase'

type MenuItem = { name: string; price: string }

const emptyItem = (): MenuItem => ({ name: '', price: '' })

export default function Booth() {
  const [booths, setBooths] = useState<BoothSummary[]>([])
  const [selectedBoothId, setSelectedBoothId] = useState<number | null>(null)
  const [menus, setMenus] = useState<BoothMenu[]>([])

  const [boothModalOpen, setBoothModalOpen] = useState(false)
  const [boothName, setBoothName] = useState('')
  const [boothDesc, setBoothDesc] = useState('')
  const [boothImage, setBoothImage] = useState<File | null>(null)
  const [boothError, setBoothError] = useState('')
  const [boothSubmitting, setBoothSubmitting] = useState(false)

  const [menuModalOpen, setMenuModalOpen] = useState(false)
  const [mainMenus, setMainMenus] = useState<MenuItem[]>([emptyItem()])
  const [subMenus, setSubMenus] = useState<MenuItem[]>([emptyItem()])
  const [setMenuItems, setSetMenuItems] = useState<MenuItem[]>([emptyItem()])

  const refreshBooths = () => getBooths().then((res) => setBooths(res.data))
  const refreshMenus = (boothId: number) =>
    getBoothMenu(boothId).then((res) => setMenus(res.data))

  useEffect(() => {
    refreshBooths()
  }, [])

  const openMenuModal = (boothId: number) => {
    setSelectedBoothId(boothId)
    setMenuModalOpen(true)
    refreshMenus(boothId)
  }

  const resetMenuForm = () => {
    setMainMenus([emptyItem()])
    setSubMenus([emptyItem()])
    setSetMenuItems([emptyItem()])
  }

  const handleBoothSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setBoothError('')
    setBoothSubmitting(true)
    let uploaded: UploadedImage | null = null
    try {
      if (boothImage) uploaded = await uploadImage(boothImage, 'booths')
      await createBooth({
        name: boothName,
        description: boothDesc,
        imageUrl: uploaded?.publicUrl,
      })
      setBoothModalOpen(false)
      setBoothName('')
      setBoothDesc('')
      setBoothImage(null)
      setBoothError('')
      refreshBooths()
    } catch (err) {
      if (uploaded) removeImage(uploaded.path).catch(() => {})
      setBoothError(err instanceof Error ? err.message : '등록에 실패했습니다.')
    } finally {
      setBoothSubmitting(false)
    }
  }

  const handleMenuSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (selectedBoothId == null) return
    const all = [
      ...mainMenus,
      ...subMenus,
      ...setMenuItems,
    ].filter((m) => m.name.trim())
    for (const m of all) {
      await createBoothMenu(selectedBoothId, {
        name: m.name,
        price: Number(m.price.replace(/[^0-9]/g, '')) || 0,
      })
    }
    resetMenuForm()
    refreshMenus(selectedBoothId)
  }

  const toggleSoldOut = async (menu: BoothMenu) => {
    if (selectedBoothId == null) return
    const next = menu.status === 'SOLD_OUT' ? 'ON_SALE' : 'SOLD_OUT'
    await updateBoothMenuStatus(selectedBoothId, menu.menuId, next)
    refreshMenus(selectedBoothId)
  }

  const handleDeleteMenu = async (menuId: number) => {
    if (selectedBoothId == null) return
    await deleteBoothMenu(selectedBoothId, menuId)
    refreshMenus(selectedBoothId)
  }

  const updateItem = (
    list: MenuItem[],
    setList: (v: MenuItem[]) => void,
    idx: number,
    field: keyof MenuItem,
    value: string,
  ) => {
    const next = list.map((m, i) => (i === idx ? { ...m, [field]: value } : m))
    setList(next)
  }

  const selectedBooth = booths.find((b) => b.boothId === selectedBoothId)

  const MenuCategorySection = ({
    label,
    items,
    setItems,
  }: {
    label: string
    items: MenuItem[]
    setItems: (v: MenuItem[]) => void
  }) => (
    <div className="form-group">
      <label>{label}</label>
      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <input
            type="text"
            placeholder="예 : 김치볶음밥"
            value={item.name}
            onChange={(e) => updateItem(items, setItems, i, 'name', e.target.value)}
            style={{ flex: 1 }}
          />
          <input
            type="text"
            placeholder="가격"
            value={item.price}
            onChange={(e) => updateItem(items, setItems, i, 'price', e.target.value)}
            style={{ width: 90 }}
          />
        </div>
      ))}
      <button
        type="button"
        className="btn-outline"
        style={{ width: '100%', fontSize: 13, color: '#aaa', borderColor: '#ddd' }}
        onClick={() => setItems([...items, emptyItem()])}
      >
        + 메뉴 추가
      </button>
    </div>
  )

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
                  <th>부스 이름</th>
                  <th>학부 이름</th>
                  <th>정보</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {booths.map((booth) => (
                  <tr key={booth.boothId}>
                    <td>{booth.name}</td>
                    <td>-</td>
                    <td>-</td>
                    <td>
                      <button
                        className="btn-outline"
                        onClick={() => openMenuModal(booth.boothId)}
                      >
                        부스 메뉴 등록
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <Modal
        isOpen={boothModalOpen}
        onClose={() => { setBoothModalOpen(false); setBoothName(''); setBoothDesc(''); setBoothImage(null); setBoothError('') }}
        title="부스 정보 등록"
        description="축제에 참여하는 부스의 상세 정보를 입력해주세요"
      >
        <form className="modal-form" onSubmit={handleBoothSubmit}>
          <div className="form-group">
            <label>부스 이름 <span className="required">*</span></label>
            <input
              type="text"
              placeholder="예 : 모여봐요 미대의 숲"
              value={boothName}
              onChange={(e) => setBoothName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>부스 설명 <span className="required">*</span></label>
            <input
              type="text"
              placeholder="예 : 모여봐요 미대의 숲"
              value={boothDesc}
              onChange={(e) => setBoothDesc(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>대표 이미지 업로드 <span className="required">*</span></label>
            <label className="image-upload-box" style={{ height: 297 }}>
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => setBoothImage(e.target.files?.[0] ?? null)}
                required
              />
              {boothImage ? (
                <span style={{ fontSize: 13, color: '#333' }}>{boothImage.name}</span>
              ) : (
                <>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <span style={{ fontSize: 13, color: '#bbb', marginTop: 8 }}>클릭하여 이미지를 선택해주세요</span>
                </>
              )}
            </label>
          </div>
          {boothError && <p style={{ color: 'red', fontSize: 13, margin: '4px 0' }}>{boothError}</p>}
          <button type="submit" className="btn-black btn-block" disabled={boothSubmitting}>
            {boothSubmitting ? '등록 중…' : '등록하기'}
          </button>
        </form>
      </Modal>

      <Modal
        isOpen={menuModalOpen}
        onClose={() => { setMenuModalOpen(false); resetMenuForm() }}
        title="부스 메뉴 등록"
        description="축제에 참여하는 부스의 상세 정보를 입력해주세요"
      >
        <form className="modal-form" onSubmit={handleMenuSubmit}>
          {selectedBooth && (
            <div className="booth-name-badge">{selectedBooth.name}</div>
          )}

          <MenuCategorySection label="부스 메인메뉴" items={mainMenus} setItems={setMainMenus} />
          <MenuCategorySection label="부스 서브메뉴" items={subMenus} setItems={setSubMenus} />
          <MenuCategorySection label="부스 세트메뉴" items={setMenuItems} setItems={setSetMenuItems} />

          {menus.length > 0 && (
            <div className="form-group">
              <label>메뉴 설정</label>
              <div className="grid-container">
                {menus.map((menu) => (
                  <div key={menu.menuId} className="card-item">
                    <div className="card-info">
                      <strong style={{ fontSize: 13 }}>{menu.name}</strong>
                      <span style={{ fontSize: 12 }}>{menu.price.toLocaleString()}</span>
                    </div>
                    <div className="card-action">
                      <button
                        type="button"
                        onClick={() => handleDeleteMenu(menu.menuId)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e74c3c', fontSize: 16 }}
                      >🗑</button>
                      <span style={{ fontSize: 12 }}>품절</span>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={menu.status === 'SOLD_OUT'}
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

          <button type="submit" className="btn-black btn-block">등록하기</button>
        </form>
      </Modal>
    </Layout>
  )
}
