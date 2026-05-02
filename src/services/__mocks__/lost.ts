import type {
  LostItemCreateInput,
  LostItemDetail,
  LostItemSummary,
  LostItemUpdateInput,
} from '../lost'
import { mockResponse } from '../env'
import { loadStore, nextId, saveStore } from './store'

const KEY = 'lost_items'

const seed: LostItemDetail[] = [
  {
    lostItemId: 1,
    name: '에어팟 프로',
    description: '학생회관 1층에서 습득',
    status: 'STORED',
    category: 'ELECTRONICS',
    imageUrl: '',
  },
  {
    lostItemId: 2,
    name: '검정 지갑',
    description: '야외 공연장 벤치',
    status: 'STORED',
    category: 'WALLET_CARD',
    imageUrl: '',
  },
  {
    lostItemId: 3,
    name: '아이패드',
    description: '중앙도서관 앞',
    status: 'STORED',
    category: 'ELECTRONICS',
    imageUrl: '',
  },
  {
    lostItemId: 4,
    name: '학생증',
    description: '주인 찾음',
    status: 'CLAIMED',
    category: 'WALLET_CARD',
    imageUrl: '',
  },
]

let store: LostItemDetail[] = loadStore<LostItemDetail[]>(KEY, seed)

function persist() {
  saveStore(KEY, store)
}

function toSummary(l: LostItemDetail): LostItemSummary {
  return {
    lostItemId: l.lostItemId,
    name: l.name,
    status: l.status,
    category: l.category,
    imageUrl: l.imageUrl,
  }
}

export const mockGetLostItems = () => mockResponse<LostItemSummary[]>(store.map(toSummary))

export const mockGetLostItemDetail = (lostItemId: number) => {
  const l = store.find((x) => x.lostItemId === lostItemId)
  if (!l) return Promise.reject(new Error('LostItem not found'))
  return mockResponse<LostItemDetail>(l)
}

export const mockCreateLostItem = (data: LostItemCreateInput) => {
  const created: LostItemDetail = {
    lostItemId: nextId(store as unknown as { [k: string]: unknown }[], 'lostItemId'),
    name: data.name,
    description: data.description,
    category: data.category,
    status: 'STORED',
    imageUrl: data.imageUrl ?? '',
  }
  store = [created, ...store]
  persist()
  return mockResponse<LostItemDetail>(created)
}

export const mockUpdateLostItem = (
  lostItemId: number,
  data: LostItemUpdateInput,
) => {
  const idx = store.findIndex((x) => x.lostItemId === lostItemId)
  if (idx < 0) return Promise.reject(new Error('LostItem not found'))
  store[idx] = { ...store[idx], ...data }
  persist()
  return mockResponse<LostItemDetail>(store[idx])
}

export const mockDeleteLostItem = (lostItemId: number) => {
  const before = store.length
  store = store.filter((x) => x.lostItemId !== lostItemId)
  if (store.length === before) return Promise.reject(new Error('LostItem not found'))
  persist()
  return mockResponse<void>(undefined as unknown as void)
}
