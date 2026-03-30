import {
  createReservationRequest,
  deleteReservationRequest,
  listReservationsRequest,
  updateReservationRequest,
} from '@entities/reservation/api/reservation.api'
import { mapReservationToRow } from '@entities/reservation/model/reservation.mapper'

const listReservations = async (accessToken) => {
  const reservations = await listReservationsRequest(accessToken)
  return reservations.map(mapReservationToRow)
}

const createReservation = async (payload, accessToken) => {
  const reservation = await createReservationRequest(payload, accessToken)
  return mapReservationToRow(reservation)
}

const updateReservation = async (reservationId, payload, accessToken) => {
  const reservation = await updateReservationRequest(reservationId, payload, accessToken)
  return mapReservationToRow(reservation)
}

const deleteReservation = async (reservationId, accessToken) => {
  await deleteReservationRequest(reservationId, accessToken)
}

export { createReservation, deleteReservation, listReservations, updateReservation }
