import { useState } from 'react'
import DashboardLayout from '@shared/ui/DashboardLayout'
import useAuth from '@features/auth/hooks/useAuth'
import { residentNavItems } from '@features/resident-dashboard/data/dashboardData'

// --- DATOS FALSOS (MOCKS) PARA PROBAR LA UI ---
const mockSpaces = [
  { id: 1, name: 'Quincho Techado', capacity: 15 },
  { id: 2, name: 'Piscina (Aforo familiar)', capacity: 6 },
  { id: 3, name: 'Cancha Multiuso', capacity: 10 },
]

const mockMyReservations = [
  { id: 101, space: 'Quincho Techado', date: '2026-04-15', time: '19:00 - 23:00', status: 'aprobada' },
  { id: 102, space: 'Cancha Multiuso', date: '2026-04-18', time: '10:00 - 12:00', status: 'pendiente' },
]

const ResidentReservationsPage = () => {
  const { user } = useAuth()
  const realName = user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email : 'Residente'

  // --- ESTADOS ---
  const [reservations, setReservations] = useState(mockMyReservations)
  
  // 💡 TRUCO: Cambia esto a "true" para ver cómo el sistema bloquea al moroso
  const [hasDebt] = useState(false) 
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    spaceId: '',
    date: '',
    time: '10:00 - 14:00'
  })

  // Función simulada para crear la reserva
  const handleSubmit = (e) => {
    e.preventDefault()
    if (hasDebt) return // Protección extra

    setIsSubmitting(true)
    
    // Simulamos el tiempo de respuesta del backend (Django)
    setTimeout(() => {
      const spaceName = mockSpaces.find(s => s.id === Number(formData.spaceId))?.name
      
      const newReservation = {
        id: Math.floor(Math.random() * 1000),
        space: spaceName,
        date: formData.date,
        time: formData.time,
        status: 'pendiente'
      }

      setReservations([newReservation, ...reservations])
      setFormData({ spaceId: '', date: '', time: '10:00 - 14:00' })
      setIsSubmitting(false)
      alert('¡Solicitud enviada! Esperando aprobación de conserjería.')
    }, 800)
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
      userRole="Residente"
      userName={realName}
      title="Mis Reservas"
      navItems={residentNavItems}
    >
      <div className="max-w-5xl mx-auto pb-12 space-y-8">
        
        {/* ENCABEZADO */}
        <div>
          <h2 className="text-2xl font-bold text-stone-900">Reserva de Espacios Comunes</h2>
          <p className="text-stone-500 mt-1">Solicita quinchos, canchas y salas de eventos.</p>
        </div>

        {/* ALERTA DE DEUDA (LÓGICA DE NEGOCIO) */}
        {hasDebt ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-xl shadow-sm">
            <div className="flex items-start gap-4">
              <span className="text-3xl">⚠️</span>
              <div>
                <h3 className="text-lg font-bold text-red-800">Servicio suspendido por deuda</h3>
                <p className="text-red-600 mt-1">
                  El sistema detecta un saldo pendiente en tus gastos comunes. Por reglamento de copropiedad, 
                  es requisito estar al día para reservar espacios comunes.
                </p>
                <button className="mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                  Ir a Pagar Gastos Comunes
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* FORMULARIO DE RESERVA (Solo visible si no hay deuda) */
          <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-stone-200 bg-stone-50">
              <h3 className="font-bold text-stone-800">Nueva Solicitud</h3>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                
                <div className="md:col-span-1">
                  <label className="block text-sm font-semibold text-stone-700 mb-1">Espacio</label>
                  <select 
                    required
                    value={formData.spaceId}
                    onChange={(e) => setFormData({...formData, spaceId: e.target.value})}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                  >
                    <option value="">Selecciona...</option>
                    {mockSpaces.map(space => (
                      <option key={space.id} value={space.id}>{space.name} (Máx: {space.capacity} pax)</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-1">
                  <label className="block text-sm font-semibold text-stone-700 mb-1">Fecha</label>
                  <input 
                    type="date" 
                    required
                    min={new Date().toISOString().split('T')[0]} // No permite fechas pasadas
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>

                <div className="md:col-span-1">
                  <label className="block text-sm font-semibold text-stone-700 mb-1">Bloque Horario</label>
                  <select 
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                  >
                    <option value="10:00 - 14:00">Mañana (10:00 - 14:00)</option>
                    <option value="15:00 - 19:00">Tarde (15:00 - 19:00)</option>
                    <option value="19:00 - 23:00">Noche (19:00 - 23:00)</option>
                  </select>
                </div>

                <div className="md:col-span-1">
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 rounded-lg disabled:opacity-70 transition-colors"
                  >
                    {isSubmitting ? 'Procesando...' : 'Solicitar Reserva'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* HISTORIAL DE RESERVAS */}
        <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-stone-200 bg-stone-50">
            <h3 className="font-bold text-stone-800">Mis Solicitudes Anteriores</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white text-stone-500 text-xs uppercase tracking-wider border-b border-stone-200">
                  <th className="px-6 py-4 font-semibold">Espacio</th>
                  <th className="px-6 py-4 font-semibold">Fecha</th>
                  <th className="px-6 py-4 font-semibold">Horario</th>
                  <th className="px-6 py-4 font-semibold">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {reservations.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-stone-500">
                      No tienes reservas registradas.
                    </td>
                  </tr>
                ) : (
                  reservations.map((res) => (
                    <tr key={res.id} className="hover:bg-stone-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-stone-800">{res.space}</td>
                      <td className="px-6 py-4 text-stone-600">{res.date}</td>
                      <td className="px-6 py-4 text-stone-600">{res.time}</td>
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

export default ResidentReservationsPage
