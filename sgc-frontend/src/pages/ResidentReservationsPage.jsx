import { useCallback, useEffect, useMemo, useState } from 'react'
import DashboardLayout from '@shared/ui/DashboardLayout'
import useAuth from '@features/auth/hooks/useAuth'
import { residentNavItems } from '@features/resident-dashboard/data/dashboardData'
import {
  createReservationRequest,
  listCommonSpacesRequest,
  listReservationsRequest,
} from '@entities/reservation/api/reservation.api'
import { mapReservationToRow, toReservationStatusBadge } from '@entities/reservation/model/reservation.mapper'

const timeSlotOptions = [
  { value: '10:00|14:00', label: 'Manana (10:00 - 14:00)' },
  { value: '15:00|19:00', label: 'Tarde (15:00 - 19:00)' },
  { value: '19:00|23:00', label: 'Noche (19:00 - 23:00)' },
]

const ResidentReservationsPage = () => {
  const { user, accessToken } = useAuth()
  const realName = user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email : 'Residente'

  const [commonSpaces, setCommonSpaces] = useState([])
  const [reservations, setReservations] = useState([])
  const [hasDebt] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    spaceCode: '',
    date: '',
    timeSlot: timeSlotOptions[0].value,
    notes: '',
  })

  const loadData = useCallback(async () => {
    if (!accessToken) {
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const [spacesResponse, reservationsResponse] = await Promise.all([
        listCommonSpacesRequest(accessToken),
        listReservationsRequest(accessToken),
      ])

      setCommonSpaces(spacesResponse)
      setReservations(reservationsResponse.map(mapReservationToRow))
    } catch (loadError) {
      setError(loadError.message || 'No fue posible cargar las reservas.')
    } finally {
      setIsLoading(false)
    }
  }, [accessToken])

  useEffect(() => {
    loadData()
  }, [loadData])

  const canSubmit = useMemo(() => {
    return Boolean(formData.spaceCode && formData.date && formData.timeSlot && !hasDebt)
  }, [formData, hasDebt])

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!canSubmit) {
      return
    }

    const [startTime, endTime] = formData.timeSlot.split('|')

    setIsSubmitting(true)
    setError('')

    try {
      const createdReservation = await createReservationRequest(
        {
          common_space: formData.spaceCode,
          requester_name: realName,
          requester_role: 'residente',
          reservation_date: formData.date,
          start_time: startTime,
          end_time: endTime,
          status: 'pending',
          notes: formData.notes.trim(),
          extra_data: {},
        },
        accessToken,
      )

      setReservations((previous) => [mapReservationToRow(createdReservation), ...previous])
      setFormData({
        spaceCode: '',
        date: '',
        timeSlot: timeSlotOptions[0].value,
        notes: '',
      })
    } catch (submitError) {
      setError(submitError.message || 'No fue posible crear la reserva.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <DashboardLayout
      userRole='Residente'
      userName={realName}
      title='Mis Reservas'
      navItems={residentNavItems}
    >
      <div className='max-w-5xl mx-auto pb-12 space-y-8'>
        <div>
          <h2 className='text-2xl font-bold text-stone-900'>Reserva de Espacios Comunes</h2>
          <p className='text-stone-500 mt-1'>Solicita quinchos, canchas y salas de eventos.</p>
        </div>

        {error && (
          <div className='rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700'>{error}</div>
        )}

        {hasDebt ? (
          <div className='bg-red-50 border-l-4 border-red-500 p-6 rounded-r-xl shadow-sm'>
            <div>
              <h3 className='text-lg font-bold text-red-800'>Servicio suspendido por deuda</h3>
              <p className='text-red-600 mt-1'>Debes regularizar tus pagos para poder crear nuevas reservas.</p>
            </div>
          </div>
        ) : (
          <div className='bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden'>
            <div className='px-6 py-4 border-b border-stone-200 bg-stone-50'>
              <h3 className='font-bold text-stone-800'>Nueva Solicitud</h3>
            </div>
            <div className='p-6'>
              <form onSubmit={handleSubmit} className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-semibold text-stone-700 mb-1'>Espacio</label>
                  <select
                    required
                    value={formData.spaceCode}
                    onChange={(event) => setFormData((previous) => ({ ...previous, spaceCode: event.target.value }))}
                    className='w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none'
                  >
                    <option value=''>Selecciona...</option>
                    {commonSpaces.map((space) => (
                      <option key={space.id} value={space.code}>
                        {space.name} (Max: {space.capacity} pax)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className='block text-sm font-semibold text-stone-700 mb-1'>Fecha</label>
                  <input
                    type='date'
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={formData.date}
                    onChange={(event) => setFormData((previous) => ({ ...previous, date: event.target.value }))}
                    className='w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none'
                  />
                </div>

                <div>
                  <label className='block text-sm font-semibold text-stone-700 mb-1'>Bloque Horario</label>
                  <select
                    required
                    value={formData.timeSlot}
                    onChange={(event) => setFormData((previous) => ({ ...previous, timeSlot: event.target.value }))}
                    className='w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none'
                  >
                    {timeSlotOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className='block text-sm font-semibold text-stone-700 mb-1'>Observaciones</label>
                  <input
                    type='text'
                    value={formData.notes}
                    onChange={(event) => setFormData((previous) => ({ ...previous, notes: event.target.value }))}
                    className='w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none'
                    placeholder='Opcional'
                  />
                </div>

                <div className='md:col-span-2'>
                  <button
                    type='submit'
                    disabled={isSubmitting || !canSubmit}
                    className='w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 rounded-lg disabled:opacity-70 transition-colors'
                  >
                    {isSubmitting ? 'Procesando...' : 'Solicitar Reserva'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className='bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden'>
          <div className='px-6 py-4 border-b border-stone-200 bg-stone-50'>
            <h3 className='font-bold text-stone-800'>Mis Solicitudes Anteriores</h3>
          </div>
          <div className='overflow-x-auto'>
            <table className='w-full text-left border-collapse'>
              <thead>
                <tr className='bg-white text-stone-500 text-xs uppercase tracking-wider border-b border-stone-200'>
                  <th className='px-6 py-4 font-semibold'>Espacio</th>
                  <th className='px-6 py-4 font-semibold'>Fecha</th>
                  <th className='px-6 py-4 font-semibold'>Horario</th>
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
                ) : reservations.length === 0 ? (
                  <tr>
                    <td colSpan='4' className='px-6 py-8 text-center text-stone-500'>
                      No tienes reservas registradas.
                    </td>
                  </tr>
                ) : (
                  reservations.map((reservation) => (
                    <tr key={reservation.id} className='hover:bg-stone-50 transition-colors'>
                      <td className='px-6 py-4 font-medium text-stone-800'>{reservation.commonSpaceLabel}</td>
                      <td className='px-6 py-4 text-stone-600'>{reservation.reservationDate}</td>
                      <td className='px-6 py-4 text-stone-600'>{reservation.summary}</td>
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

export default ResidentReservationsPage
