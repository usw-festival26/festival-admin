export const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

export const ROLE_STORAGE_KEY = 'festival_admin_role'

const latencyRaw = import.meta.env.VITE_MOCK_LATENCY_MS
export const MOCK_LATENCY_MS = latencyRaw ? Number(latencyRaw) : 250

export const delay = (ms = MOCK_LATENCY_MS) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms))

export const mockResponse = <T>(data: T, ms?: number): Promise<{ data: T }> =>
  delay(ms).then(() => ({ data }))
