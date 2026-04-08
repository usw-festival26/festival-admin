import { notices as mockNotices } from '../data/mockData'

let notices = [...mockNotices]
let nextId = notices.length + 1

export async function getNotices() {
  return [...notices]
}

export async function createNotice({ title, content }) {
  const notice = {
    id: nextId++,
    title,
    content,
    views: 0,
    createdAt: new Date().toISOString().split('T')[0],
  }
  notices = [notice, ...notices]
  return notice
}

export async function updateNotice(id, { title, content }) {
  notices = notices.map((n) =>
    n.id === id ? { ...n, title, content } : n
  )
  return notices.find((n) => n.id === id)
}

export async function deleteNotice(id) {
  notices = notices.filter((n) => n.id !== id)
}
