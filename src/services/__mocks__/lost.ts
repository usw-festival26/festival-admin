import type {
  LostItemCreateInput,
  LostItemDetail,
  LostItemStatusUpdateInput,
  LostItemStatusUpdateResponse,
  LostItemSummary,
} from '../lost'
import { mockResponse } from '../env'
import { loadStore, nextId, saveStore } from './store'

const KEY = 'lost_items'

const seed: LostItemDetail[] = [
  { lostItemId: 1, name: '에어팟 프로', description: '학생회관 1층에서 습득', storageLocation: '학생회관 보관함', status: 'STORED', imageUrl: '' },
  { lostItemId: 2, name: '검정 지갑', description: '야외 공연장 벤치', storageLocation: '학생회관 보관함', status: 'STORED', imageUrl: '' },
  { lostItemId: 3, name: '아이패드', description: '중앙도서관 앞', storageLocation: '학생회관 보관함', status: 'STORED', imageUrl: '' },
  { lostItemId: 4, name: '학생증', description: '주인 찾음', storageLocation: '학생회관 보관함', status: 'CLAIMED', imageUrl: '' },
]

let store: LostItemDetail[] = loadStore<LostItemDetail[]>(KEY, seed)

function persist() { saveStore(KEY, store) }

function toSummary(l: LostItemDetail): LostItemSummary {
  return {
    lostItemId: l.lostItemId,
    name: l.name,
    storageLocation: l.storageLocation,
    status: l.status,
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
    status: 'STORED',
    imageUrl: data.imageUrl ?? '',
  }
  store = [created, ...store]
  persist()
  return mockResponse<LostItemDetail>(created)
}

export const mockUpdateLostItemStatus = (
  lostItemId: number,
  data: LostItemStatusUpdateInput,
) => {
  const idx = store.findIndex((x) => x.lostItemId === lostItemId)
  if (idx < 0) return Promise.reject(new Error('LostItem not found'))
  store[idx] = { ...store[idx], status: data.status }
  persist()
  return mockResponse<LostItemStatusUpdateResponse>({
    lostItemId,
    status: data.status,
    updatedAt: new Date().toISOString(),
  })
}
