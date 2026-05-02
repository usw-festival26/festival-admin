import { FormEvent, useEffect, useState } from 'react'
import Layout from '../components/Layout'
import Modal from '../components/Modal'
import {
  BoothDetail,
  BoothMenu,
  BoothSummary,
  createBooth,
  createBoothMenu,
  deleteBooth,
  deleteBoothMenu,
  getBoothDetail,
  getBoothMenu,
  getBooths,
  updateBooth,
  updateBoothMenuStatus,
} from '../services/booth'
import {
  UploadedImage,
  pathFromPublicUrl,
  removeImage,
  uploadImage,
} from '../services/supabase'

type MenuItem = { name: string; price: string; image: File | null }

const emptyItem = (): MenuItem => ({ name: '', price: '', image: null })

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
  const [editingBooth, setEditingBooth] = useState<BoothDetail | null>(null)

  const [menuModalOpen, setMenuModalOpen] = useState(false)
  const [mainMenus, setMainMenus] = useState<MenuItem[]>([emptyItem()])
  const [subMenus, setSubMenus] = useState<MenuItem[]>([emptyItem()])
  const [setMenuItems, setSetMenuItems] = useState<MenuItem[]>([emptyItem()])
  const [menuError, setMenuError] = useState('')
  const [menuSubmitting, setMenuSubmitting] = useState(false)

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

  const resetBoothForm = () => {
    setBoothName('')
    setBoothDesc('')
    setBoothImage(null)
    setBoothError('')
    setEditingBooth(null)
  }

  const openNewBooth = () => {
    resetBoothForm()
    setBoothModalOpen(true)
  }

  const openEditBooth = async (boothId: number) => {
    try {
      const res = await getBoothDetail(boothId)
      setEditingBooth(res.data)
      setBoothName(res.data.name)
      setBoothDesc(res.data.description)
      setBoothImage(null)
      setBoothError('')
      setBoothModalOpen(true)
    } catch {
      // 조회 실패 시 모달은 열지 않고 조용히 무시 (목록 새로고침으로 복구)
      refreshBooths()
    }
  }

  const handleBoothSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setBoothError('')
    setBoothSubmitting(true)
    let uploaded: UploadedImage | null = null
    try {
      if (boothImage) uploaded = await uploadImage(boothImage, 'booths')
      if (editingBooth) {
        await updateBooth(editingBooth.boothId, {
          name: boothName,
          description: boothDesc,
          ...(uploaded ? { imageUrl: uploaded.publicUrl } : {}),
        })
        if (uploaded) {
          const oldPath = pathFromPublicUrl(editingBooth.imageUrl)
          if (oldPath) removeImage(oldPath).catch(() => {})
        }
      } else {
        await createBooth({
          name: boothName,
          description: boothDesc,
          imageUrl: uploaded?.publicUrl,
        })
      }
      setBoothModalOpen(false)
      resetBoothForm()
      refreshBooths()
    } catch (err) {
      if (uploaded) removeImage(uploaded.path).catch(() => {})
      setBoothError(
        err instanceof Error
          ? err.message
          : editingBooth
            ? '수정에 실패했습니다.'
            : '등록에 실패했습니다.',
      )
    } finally {
      setBoothSubmitting(false)
    }
  }

  const handleBoothDelete = async () => {
    if (!editingBooth) return
    if (!window.confirm('이 부스를 삭제하시겠어요? 등록된 메뉴도 함께 삭제됩니다.')) return
    setBoothError('')
    setBoothSubmitting(true)
    try {
      await deleteBooth(editingBooth.boothId)
      const oldPath = pathFromPublicUrl(editingBooth.imageUrl)
      if (oldPath) removeImage(oldPath).catch(() => {})
      setBoothModalOpen(false)
      resetBoothForm()
      refreshBooths()
    } catch (err) {
      setBoothError(err instanceof Error ? err.message : '삭제에 실패했습니다.')
    } finally {
      setBoothSubmitting(false)
    }
  }

  const handleMenuSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (selectedBoothId == null) return
    setMenuError('')
    setMenuSubmitting(true)
    const all = [
      ...mainMenus,
      ...subMenus,
      ...setMenuItems,
    ].filter((m) => m.name.trim())
    try {
      for (const m of all) {
        let uploaded: UploadedImage | null = null
        try {
          if (m.image) uploaded = await uploadImage(m.image, 'menus')
          await createBoothMenu(selectedBoothId, {
            name: m.name,
            price: Number(m.price.replace(/[^0-9]/g, '')) || 0,
            imageUrl: uploaded?.publicUrl,
          })
        } catch (err) {
          if (uploaded) removeImage(uploaded.path).catch(() => {})
          throw err
        }
      }
      resetMenuForm()
      refreshMenus(selectedBoothId)
    } catch (err) {
      setMenuError(err instanceof Error ? err.message : '메뉴 등록에 실패했습니다.')
    } finally {
      setMenuSubmitting(false)
    }
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
    field: 'name' | 'price',
    value: string,
  ) => {
    const next = list.map((m, i) => (i === idx ? { ...m, [field]: value } : m))
    setList(next)
  }

  const updateItemImage = (
    list: MenuItem[],
    setList: (v: MenuItem[]) => void,
    idx: number,
    image: File | null,
  ) => {
    const next = list.map((m, i) => (i === idx ? { ...m, image } : m))
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
          <label
            title={item.image ? item.image.name : '이미지 추가'}
            style={{
              width: 40,
              flexShrink: 0,
              border: '1px solid #ddd',
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: 14,
              color: item.image ? '#22c55e' : '#aaa',
              background: '#fff',
            }}
          >
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => updateItemImage(items, setItems, i, e.target.files?.[0] ?? null)}
            />
            {item.image ? '✓' : '📷'}
          </label>
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
            <button className="btn-black small" onClick={openNewBooth}>
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
                    <td
                      style={{ cursor: 'pointer', textDecoration: 'underline' }}
                      onClick={() => openEditBooth(booth.boothId)}
                    >
                      {booth.name}
                    </td>
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
        onClose={() => { setBoothModalOpen(false); resetBoothForm() }}
        title={editingBooth ? '부스 정보 수정' : '부스 정보 등록'}
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
            <label>
              대표 이미지 업로드{' '}
              {!editingBooth && <span className="required">*</span>}
            </label>
            <label className="image-upload-box" style={{ height: 297 }}>
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => setBoothImage(e.target.files?.[0] ?? null)}
                required={!editingBooth}
              />
              {boothImage ? (
                <span style={{ fontSize: 13, color: '#333' }}>{boothImage.name}</span>
              ) : editingBooth ? (
                <span style={{ fontSize: 13, color: '#888' }}>
                  기존 이미지 유지 (클릭하여 변경)
                </span>
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
          <div className="login-btn-wrapper" style={{ display: 'flex', gap: 8 }}>
            <button type="submit" className="btn-black" disabled={boothSubmitting}>
              {boothSubmitting
                ? editingBooth
                  ? '저장 중…'
                  : '등록 중…'
                : editingBooth
                  ? '수정하기'
                  : '등록하기'}
            </button>
            {editingBooth && (
              <button
                type="button"
                className="btn-outline btn-outline--lg"
                onClick={handleBoothDelete}
                disabled={boothSubmitting}
              >
                삭제
              </button>
            )}
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={menuModalOpen}
        onClose={() => { setMenuModalOpen(false); resetMenuForm(); setMenuError('') }}
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

          {menuError && <p style={{ color: 'red', fontSize: 13, margin: '4px 0' }}>{menuError}</p>}
          <button type="submit" className="btn-black btn-block" disabled={menuSubmitting}>
            {menuSubmitting ? '등록 중…' : '등록하기'}
          </button>
        </form>
      </Modal>
    </Layout>
  )
}
