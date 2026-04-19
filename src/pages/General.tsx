import { FormEvent, useEffect, useState } from 'react'
import Layout from '../components/Layout'
import Modal from '../components/Modal'
import {
  NoticeDetail,
  NoticeSummary,
  createNotice,
  deleteNotice,
  getNoticeDetail,
  getNotices,
  updateNotice,
} from '../services/notice'
import {
  LostItemSummary,
  createLostItem,
  getLostItems,
  updateLostItemStatus,
} from '../services/lost'
import { FestivalEvent, createEvent, getEvents } from '../services/events'
import { Artist, createArtist, getArtists } from '../services/artists'

export default function General() {
  const [notices, setNotices] = useState<NoticeSummary[]>([])
  const [lostItems, setLostItems] = useState<LostItemSummary[]>([])
  const [events, setEvents] = useState<FestivalEvent[]>([])
  const [artists, setArtists] = useState<Artist[]>([])

  const [noticeModalOpen, setNoticeModalOpen] = useState(false)
  const [lostModalOpen, setLostModalOpen] = useState(false)
  const [editingNotice, setEditingNotice] = useState<NoticeDetail | null>(null)

  const [noticeTitle, setNoticeTitle] = useState('')
  const [noticeContent, setNoticeContent] = useState('')
  const [noticePinned, setNoticePinned] = useState(false)

  const [lostName, setLostName] = useState('')
  const [lostDesc, setLostDesc] = useState('')

  const [eventModalOpen, setEventModalOpen] = useState(false)
  const [eventTitle, setEventTitle] = useState('')
  const [eventDesc, setEventDesc] = useState('')
  const [eventImage, setEventImage] = useState<File | null>(null)

  const [lineupModalOpen, setLineupModalOpen] = useState(false)
  const [lineupName, setLineupName] = useState('')
  const [lineupDesc, setLineupDesc] = useState('')
  const [lineupImage, setLineupImage] = useState<File | null>(null)

  const refreshNotices = () => getNotices().then((res) => setNotices(res.data))
  const refreshLost = () => getLostItems().then((res) => setLostItems(res.data))

  useEffect(() => {
    refreshNotices()
    refreshLost()
    getEvents().then((res) => setEvents(res.data))
    getArtists().then((res) => setArtists(res.data))
  }, [])

  const resetNoticeForm = () => {
    setNoticeTitle('')
    setNoticeContent('')
    setNoticePinned(false)
    setEditingNotice(null)
  }

  const openNewNotice = () => {
    resetNoticeForm()
    setNoticeModalOpen(true)
  }

  const openEditNotice = async (noticeId: number) => {
    const res = await getNoticeDetail(noticeId)
    setEditingNotice(res.data)
    setNoticeTitle(res.data.title)
    setNoticeContent(res.data.content)
    setNoticePinned(res.data.pinned)
    setNoticeModalOpen(true)
  }

  const handleNoticeSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (editingNotice) {
      await updateNotice(editingNotice.noticeId, {
        title: noticeTitle,
        content: noticeContent,
        pinned: noticePinned,
      })
    } else {
      await createNotice({ title: noticeTitle, content: noticeContent, pinned: noticePinned })
    }
    setNoticeModalOpen(false)
    resetNoticeForm()
    refreshNotices()
  }

  const handleNoticeDelete = async () => {
    if (!editingNotice) return
    if (!window.confirm('이 공지를 삭제하시겠어요?')) return
    await deleteNotice(editingNotice.noticeId)
    setNoticeModalOpen(false)
    resetNoticeForm()
    refreshNotices()
  }

  const handleLostSubmit = async (e: FormEvent) => {
    e.preventDefault()
    await createLostItem({ name: lostName, description: lostDesc, status: 'STORED' })
    setLostModalOpen(false)
    setLostName('')
    setLostDesc('')
    refreshLost()
  }

  const toggleCollected = async (item: LostItemSummary) => {
    const nextStatus = item.status === 'CLAIMED' ? 'STORED' : 'CLAIMED'
    await updateLostItemStatus(item.lostItemId, { status: nextStatus })
    refreshLost()
  }

  const handleEventSubmit = async (e: FormEvent) => {
    e.preventDefault()
    await createEvent({ title: eventTitle, description: eventDesc, image: eventImage ?? undefined })
    setEventModalOpen(false)
    setEventTitle('')
    setEventDesc('')
    setEventImage(null)
    getEvents().then((res) => setEvents(res.data))
  }

  const handleLineupSubmit = async (e: FormEvent) => {
    e.preventDefault()
    await createArtist({ name: lineupName, description: lineupDesc, image: lineupImage ?? undefined })
    setLineupModalOpen(false)
    setLineupName('')
    setLineupDesc('')
    setLineupImage(null)
    getArtists().then((res) => setArtists(res.data))
  }

  return (
    <Layout>
      <section className="dashboard-body scrollable">
        <div className="hero-section">
          <h1>2026 대동제 TITLE</h1>
          <p>Go ahead and say just a little more about what this is</p>
        </div>

        {/* 공지 */}
        <div className="section-container">
          <div className="section-header">
            <h3>공지</h3>
            <button className="btn-black small" onClick={openNewNotice}>
              + 새 공지 등록
            </button>
          </div>
          <div className="list-wrapper round-box">
            {notices.length === 0 && <div className="list-item-gray">등록된 공지가 없습니다.</div>}
            {notices.map((notice) => (
              <div
                key={notice.noticeId}
                className="list-item-gray"
                style={{ cursor: 'pointer' }}
                onClick={() => openEditNotice(notice.noticeId)}
              >
                {notice.pinned ? '📌 ' : ''}
                {notice.title}
              </div>
            ))}
          </div>
        </div>

        {/* 분실물 */}
        <div className="section-container">
          <div className="section-header">
            <h3>분실물</h3>
            <button className="btn-black small" onClick={() => setLostModalOpen(true)}>
              + 분실물 등록
            </button>
          </div>
          <div className="grid-container">
            {lostItems.map((item) => (
              <div key={item.lostItemId} className="card-item">
                <div className="card-info">
                  <strong>{item.name}</strong>
                  <span>{item.storageLocation ?? ''}</span>
                </div>
                <div className="card-action">
                  <span>수거여부</span>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={item.status === 'CLAIMED'}
                      onChange={() => toggleCollected(item)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 이벤트 */}
        <div className="section-container">
          <div className="section-header">
            <h3>이벤트</h3>
            <button className="btn-black small" onClick={() => setEventModalOpen(true)}>
              + 이벤트 등록
            </button>
          </div>
          <div className="grid-container">
            {events.filter((e) => e.status === 'ongoing').map((event) => (
              <div key={event.eventId} className="event-card-wrapper">
                <div className="event-card">
                  <div className="event-text">
                    <strong>{event.title}</strong>
                    <span>{event.description}</span>
                  </div>
                </div>
                <div className="event-img-box"></div>
              </div>
            ))}
          </div>
          {events.some((e) => e.status !== 'ongoing') && (
            <>
              <hr style={{ border: 'none', borderTop: '1px solid #ddd', margin: '16px 0' }} />
              <div className="grid-container">
                {events.filter((e) => e.status !== 'ongoing').map((event) => (
                  <div key={event.eventId} className="event-card-wrapper">
                    <div className="event-card ended">
                      <div className="event-text">
                        <strong>{event.title}</strong>
                        <span>{event.description}</span>
                      </div>
                      <span className="event-ended-label">종료됨</span>
                    </div>
                    <div className="event-img-box"></div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* 라인업 */}
        <div className="section-container">
          <div className="section-header">
            <h3>라인업</h3>
            <button className="btn-black small" onClick={() => setLineupModalOpen(true)}>
              + 라인업 등록
            </button>
          </div>
          <div className="grid-container">
            {artists.map((artist) => (
              <div key={artist.artistId} className="event-card-wrapper">
                <div className="event-card">
                  <div className="event-text">
                    <strong>{artist.name}</strong>
                    <span>{artist.description}</span>
                  </div>
                </div>
                <div className="event-img-box"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Modal
        isOpen={noticeModalOpen}
        onClose={() => {
          setNoticeModalOpen(false)
          resetNoticeForm()
        }}
        title={editingNotice ? '공지 수정' : '공지 등록'}
        description="축제 관련 공지를 입력해주세요"
      >
        <form className="modal-form" onSubmit={handleNoticeSubmit}>
          <div className="form-group">
            <label>공지 제목 <span className="required">*</span></label>
            <input
              type="text"
              placeholder="공지 제목을 입력해주세요"
              value={noticeTitle}
              onChange={(e) => setNoticeTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>공지 내용 <span className="required">*</span></label>
            <input
              type="text"
              placeholder="공지 내용을 입력해주세요"
              value={noticeContent}
              onChange={(e) => setNoticeContent(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 16 }}>
              <input
                type="checkbox"
                checked={noticePinned}
                onChange={(e) => setNoticePinned(e.target.checked)}
                style={{ width: 18, height: 18, margin: 0 }}
              />
              상단 고정
            </label>
          </div>
          <div className="login-btn-wrapper" style={{ display: 'flex', gap: 8 }}>
            <button type="submit" className="btn-black">
              {editingNotice ? '수정하기' : '등록하기'}
            </button>
            {editingNotice && (
              <button type="button" className="btn-outline btn-outline--lg" onClick={handleNoticeDelete}>
                삭제
              </button>
            )}
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={eventModalOpen}
        onClose={() => { setEventModalOpen(false); setEventTitle(''); setEventDesc(''); setEventImage(null) }}
        title="이벤트 등록"
        description="이벤트의 상세 정보를 입력해주세요"
      >
        <form className="modal-form" onSubmit={handleEventSubmit}>
          <div className="form-group">
            <label>이벤트 이름 <span className="required">*</span></label>
            <input
              type="text"
              placeholder="예 : 인생네컷 부스"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>이벤트 설명</label>
            <input
              type="text"
              placeholder="예 : 마니마니 찍이용"
              value={eventDesc}
              onChange={(e) => setEventDesc(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>이미지 업로드</label>
            <label className="image-upload-box">
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => setEventImage(e.target.files?.[0] ?? null)}
              />
              {eventImage ? (
                <span style={{ fontSize: 13, color: '#333' }}>{eventImage.name}</span>
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
          <button type="submit" className="btn-black btn-block">등록하기</button>
        </form>
      </Modal>

      <Modal
        isOpen={lineupModalOpen}
        onClose={() => { setLineupModalOpen(false); setLineupName(''); setLineupDesc(''); setLineupImage(null) }}
        title="라인업 등록"
        description="이벤트의 상세 정보를 입력해주세요"
      >
        <form className="modal-form" onSubmit={handleLineupSubmit}>
          <div className="form-group">
            <label>아티스트 이름 <span className="required">*</span></label>
            <input
              type="text"
              placeholder="예 : 인생네컷 부스"
              value={lineupName}
              onChange={(e) => setLineupName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>아티스트 설명</label>
            <input
              type="text"
              placeholder="예 : 마니마니 찍이용"
              value={lineupDesc}
              onChange={(e) => setLineupDesc(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>이미지 업로드 <span className="required">*</span></label>
            <label className="image-upload-box">
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => setLineupImage(e.target.files?.[0] ?? null)}
                required
              />
              {lineupImage ? (
                <span style={{ fontSize: 13, color: '#333' }}>{lineupImage.name}</span>
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
          <button type="submit" className="btn-black btn-block">등록하기</button>
        </form>
      </Modal>

      <Modal
        isOpen={lostModalOpen}
        onClose={() => setLostModalOpen(false)}
        title="분실물 등록"
        description="분실물 정보를 입력해주세요"
      >
        <form className="modal-form" onSubmit={handleLostSubmit}>
          <div className="form-group">
            <label>물건 이름 <span className="required">*</span></label>
            <input
              type="text"
              placeholder="예: 에어팟"
              value={lostName}
              onChange={(e) => setLostName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>습득 정보 <span className="required">*</span></label>
            <input
              type="text"
              placeholder="습득 장소, 물건 정보"
              value={lostDesc}
              onChange={(e) => setLostDesc(e.target.value)}
              required
            />
          </div>
          <div className="login-btn-wrapper">
            <button type="submit" className="btn-black">등록하기</button>
          </div>
        </form>
      </Modal>
    </Layout>
  )
}
