import type {
  BoothCreateInput,
  BoothDetail,
  BoothMenu,
  BoothMenuCreateInput,
  BoothMenuUpdateInput,
  BoothSummary,
  BoothUpdateInput,
} from '../booth'
import { mockResponse } from '../env'
import { loadStore, nextId, saveStore } from './store'

const BOOTH_KEY = 'booths'
const MENU_KEY = 'booth_menus'

const boothSeed: BoothDetail[] = [
  {
    boothId: 1,
    name: '모여봐요 미대의 숲',
    description: '디자인학부 전시/체험 부스',
    imageUrl: '',
    notice: '재료 소진 시 조기 마감합니다.',
  },
  {
    boothId: 2,
    name: '컴공 떡볶이집',
    description: '컴퓨터공학과 먹거리 부스',
    imageUrl: '',
    notice: '',
  },
  {
    boothId: 3,
    name: '경영학부 포차',
    description: '경영학부 주점',
    imageUrl: '',
    notice: '',
  },
]

const menuSeed: { boothId: number; menu: BoothMenu }[] = [
  { boothId: 1, menu: { menuId: 1, name: '캐리커쳐', price: 5000, description: '즉석 캐리커쳐', imageUrl: '', status: '판매 중' } },
  { boothId: 2, menu: { menuId: 2, name: '떡볶이', price: 4000, description: '매운맛/순한맛', imageUrl: '', status: '판매 중' } },
  { boothId: 2, menu: { menuId: 3, name: '튀김', price: 3000, description: '모둠튀김', imageUrl: '', status: '품절' } },
  { boothId: 3, menu: { menuId: 4, name: '감자튀김', price: 4000, description: '', imageUrl: '', status: '판매 중' } },
]

let boothStore: BoothDetail[] = loadStore<BoothDetail[]>(BOOTH_KEY, boothSeed)
let menuStore: { boothId: number; menu: BoothMenu }[] = loadStore(MENU_KEY, menuSeed)

function persistBooths() { saveStore(BOOTH_KEY, boothStore) }
function persistMenus() { saveStore(MENU_KEY, menuStore) }

function toSummary(b: BoothDetail): BoothSummary {
  return { boothId: b.boothId, name: b.name, imageUrl: b.imageUrl }
}

export const mockGetBooths = () => mockResponse<BoothSummary[]>(boothStore.map(toSummary))

export const mockGetBoothDetail = (boothId: number) => {
  const b = boothStore.find((x) => x.boothId === boothId)
  if (!b) return Promise.reject(new Error('Booth not found'))
  return mockResponse<BoothDetail>(b)
}

export const mockCreateBooth = (data: BoothCreateInput) => {
  const created: BoothDetail = {
    boothId: nextId(boothStore as unknown as { [k: string]: unknown }[], 'boothId'),
    ...data,
  }
  boothStore = [...boothStore, created]
  persistBooths()
  return mockResponse<BoothDetail>(created)
}

export const mockUpdateBooth = (boothId: number, data: BoothUpdateInput) => {
  const idx = boothStore.findIndex((x) => x.boothId === boothId)
  if (idx < 0) return Promise.reject(new Error('Booth not found'))
  boothStore[idx] = { ...boothStore[idx], ...data }
  persistBooths()
  return mockResponse<BoothDetail>(boothStore[idx])
}

export const mockGetBoothMenu = (boothId: number) => {
  const menus = menuStore.filter((m) => m.boothId === boothId).map((m) => m.menu)
  return mockResponse<BoothMenu[]>(menus)
}

export const mockCreateBoothMenu = (boothId: number, data: BoothMenuCreateInput) => {
  const flatMenus = menuStore.map((m) => m.menu)
  const created: BoothMenu = {
    menuId: nextId(flatMenus as unknown as { [k: string]: unknown }[], 'menuId'),
    ...data,
  }
  menuStore = [...menuStore, { boothId, menu: created }]
  persistMenus()
  return mockResponse<BoothMenu>(created)
}

export const mockUpdateBoothMenu = (
  boothId: number,
  menuId: number,
  data: BoothMenuUpdateInput,
) => {
  const idx = menuStore.findIndex((m) => m.boothId === boothId && m.menu.menuId === menuId)
  if (idx < 0) return Promise.reject(new Error('Menu not found'))
  menuStore[idx] = { boothId, menu: { ...menuStore[idx].menu, ...data } }
  persistMenus()
  return mockResponse<BoothMenu>(menuStore[idx].menu)
}
