import { lostItems as mockItems } from '../data/mockData'

let items = [...mockItems]
let nextId = items.length + 1

export async function getLostItems() {
  return [...items]
}

export async function createLostItem({ name, description, location }) {
  const item = {
    id: nextId++,
    name,
    description,
    location,
    status: 'waiting',
    createdAt: new Date().toISOString().split('T')[0],
  }
  items = [item, ...items]
  return item
}

export async function toggleCollected(id) {
  items = items.map((item) =>
    item.id === id
      ? { ...item, status: item.status === 'waiting' ? 'collected' : 'waiting' }
      : item
  )
  return items.find((item) => item.id === id)
}

export async function deleteLostItem(id) {
  items = items.filter((item) => item.id !== id)
}
