import {
  RESERVATION_STORAGE_KEY,
  reservationMockList,
} from '@entities/reservation/model/reservation.model'
import { mapReservationToRow } from '@entities/reservation/model/reservation.mapper'

const loadReservationStore = () => {
  if (typeof window === 'undefined') {
    return reservationMockList
  }

  const storedValue = window.localStorage.getItem(RESERVATION_STORAGE_KEY)

  if (!storedValue) {
    window.localStorage.setItem(RESERVATION_STORAGE_KEY, JSON.stringify(reservationMockList))
    return reservationMockList
  }

  try {
    const parsedValue = JSON.parse(storedValue)
    return Array.isArray(parsedValue) ? parsedValue : reservationMockList
  } catch {
    return reservationMockList
  }
}

const saveReservationStore = (reservations) => {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(RESERVATION_STORAGE_KEY, JSON.stringify(reservations))
}

const listReservations = async () => {
  const rows = loadReservationStore()
  return rows.map(mapReservationToRow)
}

const createReservation = async (payload) => {
  const currentReservations = loadReservationStore()
  const nextReservation = {
    ...payload,
    id: currentReservations.reduce((maxId, reservation) => Math.max(maxId, reservation.id), 0) + 1,
  }

  const nextReservations = [nextReservation, ...currentReservations]
  saveReservationStore(nextReservations)

  return mapReservationToRow(nextReservation)
}

const updateReservation = async (reservationId, payload) => {
  const currentReservations = loadReservationStore()

  const nextReservations = currentReservations.map((reservation) =>
    reservation.id === reservationId ? { ...reservation, ...payload, id: reservationId } : reservation,
  )

  const updatedReservation = nextReservations.find((reservation) => reservation.id === reservationId)

  saveReservationStore(nextReservations)
  return mapReservationToRow(updatedReservation)
}

const deleteReservation = async (reservationId) => {
  const currentReservations = loadReservationStore()
  const nextReservations = currentReservations.filter((reservation) => reservation.id !== reservationId)
  saveReservationStore(nextReservations)
}

export { createReservation, deleteReservation, listReservations, updateReservation }
