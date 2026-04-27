import api from './api'
import { USE_MOCK } from './env'
import {
  mockCreateNotice,
  mockDeleteNotice,
  mockGetNoticeDetail,
  mockGetNotices,
  mockUpdateNotice,
} from './__mocks__/notice'

export interface NoticeSummary {
  noticeId: number
  title: string
  pinned: boolean
  createdAt: string
}

export interface NoticeDetail extends NoticeSummary {
  content: string
  updatedAt?: string
}

export interface NoticeCreateInput {
  title: string
  content: string
  pinned?: boolean
}

export type NoticeUpdateInput = Partial<NoticeCreateInput>

export interface NoticeDeleteResponse {
  message: string
  noticeId: number
  deletedAt: string
}

export const getNotices = () =>
  USE_MOCK ? mockGetNotices() : api.get<NoticeSummary[]>('/api/notices')

export const getNoticeDetail = (noticeId: number) =>
  USE_MOCK ? mockGetNoticeDetail(noticeId) : api.get<NoticeDetail>(`/api/notices/${noticeId}`)

export const createNotice = (data: NoticeCreateInput) =>
  USE_MOCK ? mockCreateNotice(data) : api.post<NoticeDetail>('/admin/notices', data)

export const updateNotice = (noticeId: number, data: NoticeUpdateInput) =>
  USE_MOCK
    ? mockUpdateNotice(noticeId, data)
    : api.patch<NoticeDetail>(`/admin/notices/${noticeId}`, data)

export const deleteNotice = (noticeId: number) =>
  USE_MOCK
    ? mockDeleteNotice(noticeId)
    : api.delete<NoticeDeleteResponse>(`/admin/notices/${noticeId}`)
