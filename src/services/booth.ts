import api from './api'
import { USE_MOCK } from './env'
import {
  mockCreateBooth,
  mockCreateBoothMenu,
  mockGetBoothDetail,
  mockGetBoothMenu,
  mockGetBooths,
  mockUpdateBooth,
  mockUpdateBoothMenu,
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
  notice?: string
}

export type BoothUpdateInput = Partial<BoothCreateInput>

export type BoothMenuStatus = '판매 중' | '품절' | string

export interface BoothMenu {
  menuId: number
  name: string
  price: number
  description?: string
  imageUrl?: string
  status: BoothMenuStatus
}

export interface BoothMenuCreateInput {
  name: string
  price: number
  description: string
  imageUrl?: string
  status: BoothMenuStatus
}

export type BoothMenuUpdateInput = Partial<BoothMenuCreateInput>

export const getBooths = () =>
  USE_MOCK ? mockGetBooths() : api.get<BoothSummary[]>('/api/booths')

export const getBoothDetail = (boothId: number) =>
  USE_MOCK ? mockGetBoothDetail(boothId) : api.get<BoothDetail>(`/api/booths/${boothId}`)

export const createBooth = (data: BoothCreateInput) =>
  USE_MOCK ? mockCreateBooth(data) : api.post<BoothDetail>('/admin/booths', data)

export const updateBooth = (boothId: number, data: BoothUpdateInput) =>
  USE_MOCK
    ? mockUpdateBooth(boothId, data)
    : api.patch<BoothDetail>(`/admin/booths/${boothId}`, data)

export const getBoothMenu = (boothId: number) =>
  USE_MOCK ? mockGetBoothMenu(boothId) : api.get<BoothMenu[]>(`/api/booths/${boothId}/menu`)

export const createBoothMenu = (boothId: number, data: BoothMenuCreateInput) =>
  USE_MOCK
    ? mockCreateBoothMenu(boothId, data)
    : api.post<BoothMenu>(`/admin/booths/${boothId}/menu`, data)

export const updateBoothMenu = (
  boothId: number,
  menuId: number,
  data: BoothMenuUpdateInput,
) =>
  USE_MOCK
    ? mockUpdateBoothMenu(boothId, menuId, data)
    : api.patch<BoothMenu>(`/admin/booths/${boothId}/menu/${menuId}`, data)
