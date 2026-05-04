import api from './api'
import { USE_MOCK } from './env'
import {
  mockCreateLostItem,
  mockDeleteLostItem,
  mockGetLostItemDetail,
  mockGetLostItems,
  mockUpdateLostItem,
} from './__mocks__/lost'

export type LostItemStatus = 'STORED' | 'CLAIMED' | string

export type LostItemCategory = 'ELECTRONICS' | 'WALLET_CARD' | 'CLOTHING_BAG' | 'OTHER'

export const LOST_CATEGORY_LABELS: Record<LostItemCategory, string> = {
  ELECTRONICS: '전자기기',
  WALLET_CARD: '지갑·카드',
  CLOTHING_BAG: '의류·가방',
  OTHER: '기타',
}

export const LOST_CATEGORY_VALUES = Object.keys(LOST_CATEGORY_LABELS) as LostItemCategory[]

export interface LostItemSummary {
  lostItemId: number
  name: string
  status: LostItemStatus
  imageUrl?: string
  category?: LostItemCategory
}

export interface LostItemDetail extends LostItemSummary {
  description: string
}

export interface LostItemCreateInput {
  name: string
  description: string
  category: LostItemCategory
  imageUrl?: string
}

export interface LostItemUpdateInput {
  name?: string
  description?: string
  category?: LostItemCategory
  status?: LostItemStatus
  imageUrl?: string
}

export const getLostItems = () =>
  USE_MOCK ? mockGetLostItems() : api.get<LostItemSummary[]>('/api/admin/lost-items')

export const getLostItemDetail = (lostItemId: number) =>
  USE_MOCK
    ? mockGetLostItemDetail(lostItemId)
    : api.get<LostItemDetail>(`/api/admin/lost-items/${lostItemId}`)

export const createLostItem = (data: LostItemCreateInput) =>
  USE_MOCK ? mockCreateLostItem(data) : api.post<LostItemDetail>('/api/admin/lost-items', data)

export const updateLostItem = (lostItemId: number, data: LostItemUpdateInput) =>
  USE_MOCK
    ? mockUpdateLostItem(lostItemId, data)
    : api.put<LostItemDetail>(`/api/admin/lost-items/${lostItemId}`, data)

export const updateLostItemStatus = (lostItemId: number, status: LostItemStatus) =>
  USE_MOCK
    ? mockUpdateLostItem(lostItemId, { status })
    : api.put<LostItemDetail>(`/api/admin/lost-items/${lostItemId}`, { status })

export const deleteLostItem = (lostItemId: number) =>
  USE_MOCK
    ? mockDeleteLostItem(lostItemId)
    : api.delete<void>(`/api/admin/lost-items/${lostItemId}`)
