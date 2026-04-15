import type { Artist } from '../artists'
import { mockResponse } from '../env'
import { loadStore } from './store'

const KEY = 'artists'

const seed: Artist[] = [
  { artistId: 1, name: 'AKMU', description: '메인 스테이지 헤드라이너', imageUrl: '' },
  { artistId: 2, name: '아이유', description: '스페셜 게스트', imageUrl: '' },
  { artistId: 3, name: 'DAY6', description: '락 밴드 스테이지', imageUrl: '' },
  { artistId: 4, name: '10cm', description: '어쿠스틱 스테이지', imageUrl: '' },
]

const store: Artist[] = loadStore<Artist[]>(KEY, seed)

export const mockGetArtists = () => mockResponse<Artist[]>(store)

export const mockGetArtistDetail = (artistId: number) => {
  const a = store.find((x) => x.artistId === artistId)
  if (!a) return Promise.reject(new Error('Artist not found'))
  return mockResponse<Artist>(a)
}
