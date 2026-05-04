import type { NoticeDetail, NoticeSaveInput, NoticeSummary } from '../notice'
import { mockResponse } from '../env'
import { loadStore, nextId, saveStore } from './store'

const KEY = 'notices'

const seed: NoticeDetail[] = [
  {
    noticeId: 1,
    title: '[고정] 축제 일정 안내',
    content: '2026 대동제는 5월 20일부터 22일까지 진행됩니다.',
    pinned: true,
    createdAt: '2026-04-01T09:00:00Z',
  },
  {
    noticeId: 2,
    title: '[고정] 부스 운영 안내',
    content: '부스 운영 수칙을 확인해주세요.',
    pinned: true,
    createdAt: '2026-04-02T09:00:00Z',
  },
  {
    noticeId: 3,
    title: '아티스트 라인업 공개',
    content: '메인 스테이지 라인업이 공개되었습니다.',
    pinned: false,
    createdAt: '2026-04-10T15:00:00Z',
  },
]

let store: NoticeDetail[] = loadStore<NoticeDetail[]>(KEY, seed)

function persist() {
  saveStore(KEY, store)
}

export const mockGetNotices = () => mockResponse<NoticeSummary[]>(store)

export const mockCreateNotice = (data: NoticeSaveInput) => {
  const created: NoticeDetail = {
    noticeId: nextId(store as unknown as { [k: string]: unknown }[], 'noticeId'),
    title: data.title,
    content: data.content,
    pinned: data.pinned,
    createdAt: new Date().toISOString(),
  }
  store = [created, ...store]
  persist()
  return mockResponse<NoticeDetail>(created)
}

export const mockUpdateNotice = (noticeId: number, data: NoticeSaveInput) => {
  const idx = store.findIndex((x) => x.noticeId === noticeId)
  if (idx < 0) return Promise.reject(new Error('Notice not found'))
  const updated: NoticeDetail = { ...store[idx], ...data }
  store[idx] = updated
  persist()
  return mockResponse<NoticeDetail>(updated)
}

export const mockDeleteNotice = (noticeId: number) => {
  const before = store.length
  store = store.filter((x) => x.noticeId !== noticeId)
  if (store.length === before) return Promise.reject(new Error('Notice not found'))
  persist()
  return mockResponse<void>(undefined as unknown as void)
}
