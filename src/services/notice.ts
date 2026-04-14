import api from './api'

export interface Notice {
  id: number
  title: string
  content: string
}

// TODO: 실제 엔드포인트로 교체
export const getNotices = () => api.get<Notice[]>('/notices')
export const createNotice = (data: Omit<Notice, 'id'>) => api.post<Notice>('/notices', data)
export const updateNotice = (id: number, data: Partial<Notice>) => api.patch<Notice>(`/notices/${id}`, data)
export const deleteNotice = (id: number) => api.delete(`/notices/${id}`)
