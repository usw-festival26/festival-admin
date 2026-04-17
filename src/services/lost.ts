import api from './api'
import { USE_MOCK } from './env'
import {
  mockCreateLostItem,
  mockGetLostItemDetail,
  mockGetLostItems,
  mockUpdateLostItemStatus,
} from './__mocks__/lost'

export type LostItemStatus = 'STORED' | 'CLAIMED' | string

export interface LostItemSummary {
  lostItemId: number
  name: string
  storageLocation?: string
  status: LostItemStatus
  imageUrl?: string
}

export interface LostItemDetail extends LostItemSummary {
  description: string
}

export interface LostItemCreateInput {
  name: string
  description: string
  status?: LostItemStatus
  imageUrl?: string
}

export interface LostItemStatusUpdateInput {
  status: LostItemStatus
  note?: string
}

export interface LostItemStatusUpdateResponse {
  lostItemId: number
  status: LostItemStatus
  updatedAt: string
}

export const getLostItems = () =>
  USE_MOCK ? mockGetLostItems() : api.get<LostItemSummary[]>('/api/lost-items')

export const getLostItemDetail = (lostItemId: number) =>
  USE_MOCK
    ? mockGetLostItemDetail(lostItemId)
    : api.get<LostItemDetail>(`/api/lost-items/${lostItemId}`)

export const createLostItem = (data: LostItemCreateInput) =>
  USE_MOCK ? mockCreateLostItem(data) : api.post<LostItemDetail>('/admin/lost-items', data)

export const updateLostItemStatus = (
  lostItemId: number,
  data: LostItemStatusUpdateInput,
) =>
  USE_MOCK
    ? mockUpdateLostItemStatus(lostItemId, data)
    : api.patch<LostItemStatusUpdateResponse>(
        `/admin/lost-items/${lostItemId}/status`,
        data,
      )
