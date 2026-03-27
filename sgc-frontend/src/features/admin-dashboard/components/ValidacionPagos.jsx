import { useState } from 'react'
import { pendingPaymentsMock } from '../data/adminDashboardData'

const ValidacionPagos = () => {
  // Estado para simular que vamos sacando pagos de la bandeja al aprobar/rechazar
  const [payments, setPayments] = useState(pendingPaymentsMock)

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0
    }).format(amount)
  }

  // Simulamos la acción (en el futuro esto llamará a tu API de Django)
  const handleAction = (id, action) => {
    if (action === 'aprobar') {
      alert(`Pago ${id} aprobado. El Gasto Común pasará a estado 'Pagado'.`)
    } else {
      const reason = window.prompt('Indique el motivo del rechazo (ej: Monto incorrecto):')
      if (reason) alert(`Pago ${id} rechazado. Se notificará al residente: "${reason}"`)
    }
    
    // Lo sacamos de la bandeja visualmente
    setPayments(prev => prev.filter(p => p.id !== id))
  }

  return (
    <div className="space-y-6">
      
      {/* Resumen rápido de la bandeja */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-stone-200 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-stone-800">Bandeja de Validación</h3>
          <p className="text-sm text-stone-500 mt-1">
            Revisa los comprobantes de transferencia enviados por los residentes.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-amber-100 text-amber-800 w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl">
            {payments.length}
          </div>
          <span className="text-sm font-semibold text-stone-600">Pendientes</span>
        </div>
      </div>

      {/* Lista de Comprobantes (Estilo Inbox) */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
        {payments.length === 0 ? (
          <div className="p-12 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto text-stone-300 mb-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-bold text-stone-700">¡Bandeja al día!</h3>
            <p className="text-stone-500 mt-1">No hay comprobantes pendientes por revisar.</p>
          </div>
        ) : (
          <ul className="divide-y divide-stone-200">
            {payments.map((payment) => (
              <li key={payment.id} className="p-6 hover:bg-stone-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                {/* Info del Residente y Monto */}
                <div className="flex items-start gap-4">
                  <div className="bg-stone-100 p-3 rounded-lg text-center min-w-[4rem]">
                    <span className="block text-xs font-bold text-stone-400 uppercase">Depto</span>
                    <span className="block text-lg font-bold text-stone-800">{payment.unit}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900 text-lg">{formatCurrency(payment.amountDeclared)}</h4>
                    <p className="text-sm text-stone-600">Enviado por {payment.owner} el {payment.dateSubmitted}</p>
                    <p className="text-xs text-stone-400 mt-1 font-mono">Ref Banco: {payment.bankReference}</p>
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
                  <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-stone-600 hover:bg-stone-200 bg-stone-100 rounded-lg transition-colors w-full sm:w-auto justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                    Ver Comprobante
                  </button>
                  
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button 
                      onClick={() => handleAction(payment.id, 'rechazar')}
                      className="flex-1 px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 text-sm font-bold rounded-lg transition-colors text-center"
                    >
                      Rechazar
                    </button>
                    <button 
                      onClick={() => handleAction(payment.id, 'aprobar')}
                      className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-lg transition-colors shadow-sm text-center"
                    >
                      Aprobar
                    </button>
                  </div>
                </div>

              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default ValidacionPagos