import type { FestivalEvent } from '../events'
import { mockResponse } from '../env'
import { loadStore } from './store'

const KEY = 'events'

const seed: FestivalEvent[] = [
  { eventId: 1, title: '스탬프 투어', description: '부스 5곳 방문 시 기념품 증정', imageUrl: '', status: 'ongoing', createdAt: '2026-04-05T09:00:00Z' },
  { eventId: 2, title: '포토 콘테스트', description: '#2026대동제 해시태그', imageUrl: '', status: 'ongoing', createdAt: '2026-04-06T09:00:00Z' },
  { eventId: 3, title: '사전 예매 이벤트', description: '조기 마감', imageUrl: '', status: 'ended', createdAt: '2026-03-20T09:00:00Z' },
]

const store: FestivalEvent[] = loadStore<FestivalEvent[]>(KEY, seed)

export const mockGetEvents = () => mockResponse<FestivalEvent[]>(store)

export const mockGetEventDetail = (eventId: number) => {
  const e = store.find((x) => x.eventId === eventId)
  if (!e) return Promise.reject(new Error('Event not found'))
  return mockResponse<FestivalEvent>(e)
}
