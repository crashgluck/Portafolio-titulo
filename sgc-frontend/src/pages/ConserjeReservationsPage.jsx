import { useCallback, useEffect, useMemo, useState } from 'react'
import DashboardLayout from '@shared/ui/DashboardLayout'
import useAuth from '@features/auth/hooks/useAuth'
import { conserjeNavItems } from '@features/conserje-dashboard/data/conserjeDashboardData'
import { listReservationsRequest } from '@entities/reservation/api/reservation.api'
import { mapReservationToRow, toReservationStatusBadge } from '@entities/reservation/model/reservation.mapper'

const ConserjeReservationsPage = () => {
  const { user, accessToken } = useAuth()
  const realName = user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email : 'Conserjeria'

  const [reservations, setReservations] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const loadReservations = useCallback(async () => {
    if (!accessToken) {
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await listReservationsRequest(accessToken)
      setReservations(response.map(mapReservationToRow))
    } catch (loadError) {
      setError(loadError.message || 'No fue posible cargar las reservas.')
    } finally {
      setIsLoading(false)
    }
  }, [accessToken])

  useEffect(() => {
    loadReservations()
  }, [loadReservations])

  const pendingReservations = useMemo(
    () => reservations.filter((reservation) => reservation.status === 'pending'),
    [reservations],
  )
  const historyReservations = useMemo(
    () => reservations.filter((reservation) => reservation.status !== 'pending'),
    [reservations],
  )

  return (
    <DashboardLayout userRole='Conserjeria' userName={realName} title='Reservas (solo lectura)' navItems={conserjeNavItems}>
      <div className='max-w-6xl mx-auto pb-12 space-y-8'>
        <div className='flex flex-col gap-3 md:flex-row md:items-end md:justify-between'>
          <div>
            <h2 className='text-2xl font-bold text-stone-900'>Solicitudes de Espacios Comunes</h2>
            <p className='text-stone-500 mt-1'>Vista operativa de reservas para conserjeria. Solo lectura.</p>
          </div>
          <button
            onClick={loadReservations}
            className='px-4 py-2 rounded-lg border border-stone-300 text-stone-700 font-semibold hover:bg-stone-50 transition-colors'
          >
            Actualizar
          </button>
        </div>

        {error && (
          <div className='rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700'>{error}</div>
        )}

        <div className='bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden border-t-4 border-t-amber-500'>
          <div className='px-6 py-4 border-b border-stone-200 bg-stone-50 flex justify-between items-center'>
            <h3 className='font-bold text-stone-800 flex items-center gap-2'>
              <span className='bg-amber-100 text-amber-800 py-0.5 px-2 rounded text-sm'>{pendingReservations.length}</span>
              Pendientes de Revision
            </h3>
          </div>
          <div className='overflow-x-auto'>
            <table className='w-full text-left border-collapse'>
              <thead>
                <tr className='bg-white text-stone-500 text-xs uppercase tracking-wider border-b border-stone-200'>
                  <th className='px-6 py-4 font-semibold'>Residente</th>
                  <th className='px-6 py-4 font-semibold'>Rol</th>
                  <th className='px-6 py-4 font-semibold'>Espacio</th>
                  <th className='px-6 py-4 font-semibold'>Fecha y Hora</th>
                  <th className='px-6 py-4 font-semibold'>Estado</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-stone-200'>
                {isLoading ? (
                  <tr>
                    <td colSpan='5' className='px-6 py-8 text-center text-stone-500'>
                      Cargando reservas...
                    </td>
                  </tr>
                ) : pendingReservations.length === 0 ? (
                  <tr>
                    <td colSpan='5' className='px-6 py-8 text-center text-stone-500'>
                      No hay solicitudes pendientes.
                    </td>
                  </tr>
                ) : (
                  pendingReservations.map((reservation) => (
                    <tr key={reservation.id} className='hover:bg-amber-50/30 transition-colors'>
                      <td className='px-6 py-4 font-bold text-stone-800'>{reservation.requesterName}</td>
                      <td className='px-6 py-4 font-medium text-stone-600 capitalize'>{reservation.requesterRole}</td>
                      <td className='px-6 py-4 text-stone-700'>{reservation.commonSpaceLabel}</td>
                      <td className='px-6 py-4 text-sm text-stone-600'>
                        <div className='font-semibold text-stone-800'>{reservation.reservationDate}</div>
                        <div>{reservation.summary}</div>
                      </td>
                      <td className='px-6 py-4'>
                        <span
                          className={`inline-flex rounded-md px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${toReservationStatusBadge(
                            reservation.status,
                          )}`}
                        >
                          {reservation.statusLabel}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className='bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden'>
          <div className='px-6 py-4 border-b border-stone-200 bg-stone-50'>
            <h3 className='font-bold text-stone-800'>Historial y Agenda</h3>
          </div>
          <div className='overflow-x-auto'>
            <table className='w-full text-left border-collapse'>
              <thead>
                <tr className='bg-white text-stone-500 text-xs uppercase tracking-wider border-b border-stone-200'>
                  <th className='px-6 py-4 font-semibold'>Residente</th>
                  <th className='px-6 py-4 font-semibold'>Espacio</th>
                  <th className='px-6 py-4 font-semibold'>Fecha</th>
                  <th className='px-6 py-4 font-semibold'>Estado</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-stone-200'>
                {isLoading ? (
                  <tr>
                    <td colSpan='4' className='px-6 py-8 text-center text-stone-500'>
                      Cargando reservas...
                    </td>
                  </tr>
                ) : historyReservations.length === 0 ? (
                  <tr>
                    <td colSpan='4' className='px-6 py-8 text-center text-stone-500'>
                      No hay registros historicos.
                    </td>
                  </tr>
                ) : (
                  historyReservations.map((reservation) => (
                    <tr key={reservation.id} className='hover:bg-stone-50 transition-colors'>
                      <td className='px-6 py-4'>
                        <div className='font-medium text-stone-800'>{reservation.requesterName}</div>
                        <div className='text-xs text-stone-500 capitalize'>{reservation.requesterRole}</div>
                      </td>
                      <td className='px-6 py-4 text-stone-700'>{reservation.commonSpaceLabel}</td>
                      <td className='px-6 py-4 text-sm text-stone-600'>
                        {reservation.reservationDate}
                        <br />
                        <span className='text-xs'>{reservation.summary}</span>
                      </td>
                      <td className='px-6 py-4'>
                        <span
                          className={`inline-flex rounded-md px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${toReservationStatusBadge(
                            reservation.status,
                          )}`}
                        >
                          {reservation.statusLabel}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default ConserjeReservationsPage
