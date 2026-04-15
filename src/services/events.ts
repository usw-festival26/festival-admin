import api from './api'
import { USE_MOCK } from './env'
import { mockGetEventDetail, mockGetEvents } from './__mocks__/events'

export type EventStatus = 'ongoing' | 'ended' | string

export interface FestivalEvent {
  eventId: number
  title: string
  description: string
  imageUrl?: string
  status: EventStatus
  createdAt: string
}

export const getEvents = () =>
  USE_MOCK ? mockGetEvents() : api.get<FestivalEvent[]>('/api/events')

export const getEventDetail = (eventId: number) =>
  USE_MOCK ? mockGetEventDetail(eventId) : api.get<FestivalEvent>(`/api/events/${eventId}`)
