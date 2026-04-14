import api from './api'

export interface Booth {
  id: number
  name: string
  department: string
  info: string
}

export interface BoothMenu {
  id: number
  boothId: number
  menuName: string
  price: string
}

// TODO: 실제 엔드포인트로 교체
export const getBooths = () => api.get<Booth[]>('/booths')
export const createBooth = (data: Omit<Booth, 'id'>) => api.post<Booth>('/booths', data)
export const updateBooth = (id: number, data: Partial<Booth>) => api.patch<Booth>(`/booths/${id}`, data)
export const deleteBooth = (id: number) => api.delete(`/booths/${id}`)

export const getBoothMenus = (boothId: number) => api.get<BoothMenu[]>(`/booths/${boothId}/menus`)
export const createBoothMenu = (boothId: number, data: Omit<BoothMenu, 'id' | 'boothId'>) =>
  api.post<BoothMenu>(`/booths/${boothId}/menus`, data)
