import api from './api'
import { USE_MOCK } from './env'
import { mockGetArtistDetail, mockGetArtists } from './__mocks__/artists'

export interface Artist {
  artistId: number
  name: string
  description: string
  imageUrl?: string
}

export const getArtists = () =>
  USE_MOCK ? mockGetArtists() : api.get<Artist[]>('/api/artists')

export const getArtistDetail = (artistId: number) =>
  USE_MOCK ? mockGetArtistDetail(artistId) : api.get<Artist>(`/api/artists/${artistId}`)
