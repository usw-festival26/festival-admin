import api from './api'

export interface LostItem {
  id: number
  name: string
  info: string
  collected: boolean
}

// TODO: 실제 엔드포인트로 교체
export const getLostItems = () => api.get<LostItem[]>('/lost-items')
export const createLostItem = (data: Omit<LostItem, 'id'>) => api.post<LostItem>('/lost-items', data)
export const updateLostItem = (id: number, data: Partial<LostItem>) => api.patch<LostItem>(`/lost-items/${id}`, data)
export const deleteLostItem = (id: number) => api.delete(`/lost-items/${id}`)
