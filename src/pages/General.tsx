import { useState } from 'react'
import Layout from '../components/Layout'
import Modal from '../components/Modal'

interface LostItem {
  id: number
  name: string
  info: string
  collected: boolean
}

interface EventItem {
  id: number
  name: string
  info: string
  active: boolean
}

const initialLostItems: LostItem[] = [
  { id: 1, name: '에어팟', info: '습득장소 등등 물건정보', collected: false },
  { id: 2, name: '에어팟', info: '물건정보', collected: true },
]

const initialEvents: EventItem[] = [
  { id: 1, name: '이벤트 이름', info: '이벤트 정보', active: true },
  { id: 2, name: '이벤트 이름', info: '이벤트 정보', active: false },
]

const initialNotices = ['공지입니다당', '공지예요', '공지공지']

export default function General() {
  const [noticeModalOpen, setNoticeModalOpen] = useState(false)
  const [lostModalOpen, setLostModalOpen] = useState(false)
  const [eventModalOpen, setEventModalOpen] = useState(false)

  const [notices] = useState<string[]>(initialNotices)
  const [lostItems, setLostItems] = useState<LostItem[]>(initialLostItems)
  const [events] = useState<EventItem[]>(initialEvents)

  const toggleCollected = (id: number) => {
    setLostItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, collected: !item.collected } : item))
    )
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
            <button className="btn-black small" onClick={() => setNoticeModalOpen(true)}>
              + 새 공지 등록
            </button>
          </div>
          <div className="list-wrapper round-box">
            {notices.map((notice, idx) => (
              <div key={idx} className="list-item-gray">{notice}</div>
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
              <div key={item.id} className="card-item">
                <div className="card-info">
                  <strong>{item.name}</strong>
                  <span>{item.info}</span>
                </div>
                <div className="card-action">
                  <span>수거여부</span>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={item.collected}
                      onChange={() => toggleCollected(item.id)}
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
            {events.map((event) => (
              <div key={event.id} className="card-item-with-img">
                <div className="event-text">
                  <strong>{event.name}</strong>
                  <span>{event.info}</span>
                  <span className={event.active ? 'status-green' : 'status-red'}>
                    {event.active ? '진행 중' : '종료'}
                  </span>
                </div>
                <div className="img-placeholder-small"></div>
              </div>
            ))}
          </div>
        </div>

        <div className="bottom-action">
          <button className="btn-outline-round">화면 앱 동기</button>
        </div>
      </section>

      <Modal
        isOpen={noticeModalOpen}
        onClose={() => setNoticeModalOpen(false)}
        title="공지 등록"
        description="축제 관련 공지를 입력해주세요"
      >
        <form className="modal-form" onSubmit={(e) => { e.preventDefault(); setNoticeModalOpen(false) }}>
          <div className="form-group">
            <label>공지 제목 <span className="required">*</span></label>
            <input type="text" placeholder="공지 제목을 입력해주세요" required />
          </div>
          <div className="form-group">
            <label>공지 내용 <span className="required">*</span></label>
            <input type="text" placeholder="공지 내용을 입력해주세요" required />
          </div>
          <div className="login-btn-wrapper">
            <button type="submit" className="btn-black">등록하기</button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={lostModalOpen}
        onClose={() => setLostModalOpen(false)}
        title="분실물 등록"
        description="분실물 정보를 입력해주세요"
      >
        <form className="modal-form" onSubmit={(e) => { e.preventDefault(); setLostModalOpen(false) }}>
          <div className="form-group">
            <label>물건 이름 <span className="required">*</span></label>
            <input type="text" placeholder="예: 에어팟" required />
          </div>
          <div className="form-group">
            <label>습득 정보 <span className="required">*</span></label>
            <input type="text" placeholder="습득 장소, 물건 정보" required />
          </div>
          <div className="login-btn-wrapper">
            <button type="submit" className="btn-black">등록하기</button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={eventModalOpen}
        onClose={() => setEventModalOpen(false)}
        title="이벤트 등록"
        description="이벤트 정보를 입력해주세요"
      >
        <form className="modal-form" onSubmit={(e) => { e.preventDefault(); setEventModalOpen(false) }}>
          <div className="form-group">
            <label>이벤트 이름 <span className="required">*</span></label>
            <input type="text" placeholder="이벤트 이름을 입력해주세요" required />
          </div>
          <div className="form-group">
            <label>이벤트 정보 <span className="required">*</span></label>
            <input type="text" placeholder="이벤트 정보를 입력해주세요" required />
          </div>
          <div className="login-btn-wrapper">
            <button type="submit" className="btn-black">등록하기</button>
          </div>
        </form>
      </Modal>
    </Layout>
  )
}
