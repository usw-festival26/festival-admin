const PREFIX = 'festival_admin_mock_'

export function loadStore<T>(key: string, seed: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    if (!raw) return seed
    return JSON.parse(raw) as T
  } catch {
    return seed
  }
}

export function saveStore<T>(key: string, value: T): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch {
    // ignore quota errors
  }
}

export function nextId(items: { [key: string]: unknown }[], idField: string): number {
  const max = items.reduce((acc, item) => {
    const v = item[idField]
    return typeof v === 'number' && v > acc ? v : acc
  }, 0)
  return max + 1
}
