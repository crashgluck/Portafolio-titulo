import { useState } from 'react'
import DashboardLayout from '@shared/ui/DashboardLayout'
import useAuth from '@features/auth/hooks/useAuth'
import { conserjeNavItems } from '@features/conserje-dashboard/data/conserjeDashboardData'

// --- DATOS FALSOS (MOCKS) PARA PROBAR LA UI ---
const initialReservations = [
  { id: 1, resident: 'Carlos Pinto', apt: '402-A', space: 'Quincho Techado', date: '2026-04-15', time: '19:00 - 23:00', status: 'pendiente' },
  { id: 2, resident: 'María González', apt: '105-B', space: 'Cancha Multiuso', date: '2026-04-18', time: '10:00 - 12:00', status: 'pendiente' },
  { id: 3, resident: 'Familia Soto', apt: '701-A', space: 'Piscina', date: '2026-04-10', time: '15:00 - 19:00', status: 'aprobada' },
  { id: 4, resident: 'Juan Pérez', apt: '203-B', space: 'Quincho Techado', date: '2026-04-11', time: '19:00 - 23:00', status: 'rechazada' },
]

const ConserjeReservationsPage = () => {
  const { user } = useAuth()
  const realName = user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email : 'Conserjería'

  const [reservations, setReservations] = useState(initialReservations)
  const [isProcessing, setIsProcessing] = useState(null)

  // Separar pendientes del historial
  const pendingReservations = reservations.filter(r => r.status === 'pendiente')
  const historyReservations = reservations.filter(r => r.status !== 'pendiente')

  // Función simulada para aprobar o rechazar
  const handleAction = (id, newStatus) => {
    setIsProcessing(id)
    
    // Simulamos el tiempo de respuesta del backend
    setTimeout(() => {
      setReservations(prev => 
        prev.map(res => res.id === id ? { ...res, status: newStatus } : res)
      )
      setIsProcessing(null)
    }, 600)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'aprobada': return <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold uppercase">Aprobada</span>
      case 'pendiente': return <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold uppercase">Pendiente</span>
      case 'rechazada': return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold uppercase">Rechazada</span>
      default: return null
    }
  }

  return (
    <DashboardLayout
      userRole="Conserjería"
      userName={realName}
      title="Gestión de Reservas"
      navItems={conserjeNavItems}
    >
      <div className="max-w-6xl mx-auto pb-12 space-y-8">
        
        {/* ENCABEZADO */}
        <div>
          <h2 className="text-2xl font-bold text-stone-900">Solicitudes de Espacios Comunes</h2>
          <p className="text-stone-500 mt-1">Revisa y gestiona las reservas solicitadas por los residentes.</p>
        </div>

        {/* SECCIÓN 1: SOLICITUDES PENDIENTES */}
        <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden border-t-4 border-t-amber-500">
          <div className="px-6 py-4 border-b border-stone-200 bg-stone-50 flex justify-between items-center">
            <h3 className="font-bold text-stone-800 flex items-center gap-2">
              <span className="bg-amber-100 text-amber-800 py-0.5 px-2 rounded text-sm">{pendingReservations.length}</span>
              Pendientes de Revisión
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white text-stone-500 text-xs uppercase tracking-wider border-b border-stone-200">
                  <th className="px-6 py-4 font-semibold">Residente</th>
                  <th className="px-6 py-4 font-semibold">Depto</th>
                  <th className="px-6 py-4 font-semibold">Espacio</th>
                  <th className="px-6 py-4 font-semibold">Fecha y Hora</th>
                  <th className="px-6 py-4 font-semibold text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {pendingReservations.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-stone-500">
                      No hay solicitudes pendientes.
                    </td>
                  </tr>
                ) : (
                  pendingReservations.map((res) => (
                    <tr key={res.id} className="hover:bg-amber-50/30 transition-colors">
                      <td className="px-6 py-4 font-bold text-stone-800">{res.resident}</td>
                      <td className="px-6 py-4 font-medium text-stone-600">{res.apt}</td>
                      <td className="px-6 py-4 text-stone-700">{res.space}</td>
                      <td className="px-6 py-4 text-sm text-stone-600">
                        <div className="font-semibold text-stone-800">{res.date}</div>
                        <div>{res.time}</div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {isProcessing === res.id ? (
                          <span className="text-sm text-stone-500 font-medium animate-pulse">Procesando...</span>
                        ) : (
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => handleAction(res.id, 'rechazada')}
                              className="px-3 py-1.5 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                            >
                              Rechazar
                            </button>
                            <button 
                              onClick={() => handleAction(res.id, 'aprobada')}
                              className="px-3 py-1.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md transition-colors shadow-sm"
                            >
                              Aprobar
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECCIÓN 2: HISTORIAL DE RESERVAS */}
        <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-stone-200 bg-stone-50">
            <h3 className="font-bold text-stone-800">Historial y Agenda</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white text-stone-500 text-xs uppercase tracking-wider border-b border-stone-200">
                  <th className="px-6 py-4 font-semibold">Residente</th>
                  <th className="px-6 py-4 font-semibold">Espacio</th>
                  <th className="px-6 py-4 font-semibold">Fecha</th>
                  <th className="px-6 py-4 font-semibold">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {historyReservations.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-stone-500">
                      No hay registros históricos.
                    </td>
                  </tr>
                ) : (
                  historyReservations.map((res) => (
                    <tr key={res.id} className="hover:bg-stone-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-stone-800">{res.resident}</div>
                        <div className="text-xs text-stone-500">Depto {res.apt}</div>
                      </td>
                      <td className="px-6 py-4 text-stone-700">{res.space}</td>
                      <td className="px-6 py-4 text-sm text-stone-600">
                        {res.date} <br/><span className="text-xs">{res.time}</span>
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(res.status)}</td>
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