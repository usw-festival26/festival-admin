import { booths as mockBooths } from '../data/mockData'

let booths = structuredClone(mockBooths)
let nextBoothId = booths.length + 1
let nextMenuId = 100

export async function getBooths() {
  return structuredClone(booths)
}

export async function createBooth({ name, department, location }) {
  const booth = { id: nextBoothId++, name, department, location, menus: [] }
  booths = [...booths, booth]
  return booth
}

export async function updateBooth(id, data) {
  booths = booths.map((b) => (b.id === id ? { ...b, ...data } : b))
  return booths.find((b) => b.id === id)
}

export async function deleteBooth(id) {
  booths = booths.filter((b) => b.id !== id)
}

export async function addMenu(boothId, { name, price }) {
  const menu = { id: nextMenuId++, name, price, soldOut: false }
  booths = booths.map((b) =>
    b.id === boothId ? { ...b, menus: [...b.menus, menu] } : b
  )
  return menu
}

export async function toggleSoldOut(boothId, menuId) {
  booths = booths.map((b) =>
    b.id === boothId
      ? {
          ...b,
          menus: b.menus.map((m) =>
            m.id === menuId ? { ...m, soldOut: !m.soldOut } : m
          ),
        }
      : b
  )
}
