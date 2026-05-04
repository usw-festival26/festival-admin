import api from './api'
import { USE_MOCK } from './env'
import {
  mockCreateNotice,
  mockDeleteNotice,
  mockGetNotices,
  mockUpdateNotice,
} from './__mocks__/notice'

export interface NoticeSummary {
  noticeId: number
  title: string
  content: string
  pinned: boolean
  createdAt: string
}

export type NoticeDetail = NoticeSummary

export interface NoticeSaveInput {
  title: string
  content: string
  pinned: boolean
}

export const getNotices = () =>
  USE_MOCK ? mockGetNotices() : api.get<NoticeSummary[]>('/api/admin/notices')

export const createNotice = (data: NoticeSaveInput) =>
  USE_MOCK ? mockCreateNotice(data) : api.post<NoticeDetail>('/api/admin/notices', data)

export const updateNotice = (noticeId: number, data: NoticeSaveInput) =>
  USE_MOCK
    ? mockUpdateNotice(noticeId, data)
    : api.put<NoticeDetail>(`/api/admin/notices/${noticeId}`, data)

export const deleteNotice = (noticeId: number) =>
  USE_MOCK ? mockDeleteNotice(noticeId) : api.delete<void>(`/api/admin/notices/${noticeId}`)
