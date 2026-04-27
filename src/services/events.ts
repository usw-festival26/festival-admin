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

export interface CreateEventPayload {
  title: string
  description: string
  image?: File
}

export const getEvents = () =>
  USE_MOCK ? mockGetEvents() : api.get<FestivalEvent[]>('/api/events')

export const getEventDetail = (eventId: number) =>
  USE_MOCK ? mockGetEventDetail(eventId) : api.get<FestivalEvent>(`/api/events/${eventId}`)

export const createEvent = (payload: CreateEventPayload) =>
  api.post<FestivalEvent>('/api/events', payload)
