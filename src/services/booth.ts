import api from './api'
import { USE_MOCK } from './env'
import {
  mockCreateBooth,
  mockCreateBoothMenu,
  mockDeleteBoothMenu,
  mockGetBoothDetail,
  mockGetBoothMenu,
  mockGetBooths,
  mockUpdateBooth,
  mockUpdateBoothMenu,
  mockUpdateBoothMenuStatus,
} from './__mocks__/booth'

export interface BoothSummary {
  boothId: number
  name: string
  imageUrl?: string
}

export interface BoothDetail extends BoothSummary {
  description: string
  notice?: string
}

export interface BoothCreateInput {
  name: string
  description: string
  imageUrl?: string
}

export type BoothUpdateInput = Partial<BoothCreateInput>

export type BoothMenuStatus = 'ON_SALE' | 'SOLD_OUT'

export const BOOTH_MENU_STATUS_LABELS: Record<BoothMenuStatus, string> = {
  ON_SALE: '판매 중',
  SOLD_OUT: '품절',
}

export interface BoothMenu {
  menuId: number
  name: string
  price: number
  imageUrl?: string
  status: BoothMenuStatus
}

export interface BoothMenuCreateInput {
  name: string
  price: number
  imageUrl?: string
}

export type BoothMenuUpdateInput = Partial<BoothMenuCreateInput>

export const getBooths = () =>
  USE_MOCK ? mockGetBooths() : api.get<BoothSummary[]>('/api/admin/booths')

export const getBoothDetail = (boothId: number) =>
  USE_MOCK
    ? mockGetBoothDetail(boothId)
    : api.get<BoothDetail>(`/api/admin/booths/${boothId}`)

export const createBooth = (data: BoothCreateInput) =>
  USE_MOCK ? mockCreateBooth(data) : api.post<BoothDetail>('/api/admin/booths', data)

export const updateBooth = (boothId: number, data: BoothUpdateInput) =>
  USE_MOCK
    ? mockUpdateBooth(boothId, data)
    : api.patch<BoothDetail>(`/api/admin/booths/${boothId}`, data)

export const getBoothMenu = (boothId: number) =>
  USE_MOCK
    ? mockGetBoothMenu(boothId)
    : api.get<BoothMenu[]>(`/api/admin/booths/${boothId}/menus`)

export const createBoothMenu = (boothId: number, data: BoothMenuCreateInput) =>
  USE_MOCK
    ? mockCreateBoothMenu(boothId, data)
    : api.post<BoothMenu>(`/api/admin/booths/${boothId}/menus`, data)

export const updateBoothMenu = (
  boothId: number,
  menuId: number,
  data: BoothMenuUpdateInput,
) =>
  USE_MOCK
    ? mockUpdateBoothMenu(boothId, menuId, data)
    : api.patch<BoothMenu>(`/api/admin/booths/${boothId}/menus/${menuId}`, data)

export const deleteBoothMenu = (boothId: number, menuId: number) =>
  USE_MOCK
    ? mockDeleteBoothMenu(boothId, menuId)
    : api.delete<void>(`/api/admin/booths/${boothId}/menus/${menuId}`)

export const updateBoothMenuStatus = (
  boothId: number,
  menuId: number,
  status: BoothMenuStatus,
) =>
  USE_MOCK
    ? mockUpdateBoothMenuStatus(boothId, menuId, status)
    : api.patch<BoothMenu>(
        `/api/admin/booths/${boothId}/menus/${menuId}/status`,
        { status },
      )
