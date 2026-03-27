import { useState } from 'react'
import { financialStats } from '../data/adminDashboardData'

const CierreMes = () => {
  const [step, setStep] = useState(1) // 1: Resumen, 2: Procesando, 3: Éxito

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(amount)
  }

  const handleExecute = () => {
    setStep(2)
    // Simulamos el tiempo que tardaría el Stored Procedure en la BD
    setTimeout(() => {
      setStep(3)
    }, 3000)
  }

  return (
    <div className="max-w-3xl">
      {/* TARJETA PRINCIPAL */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
        
        {/* Cabecera de Peligro/Importancia */}
        <div className="px-6 py-5 border-b border-stone-200 bg-stone-900 text-white flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-amber-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2.25m0 4.5h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="text-lg font-bold">Ejecución de Cierre Mensual</h3>
            <p className="text-sm text-stone-300 mt-1">Marzo 2026</p>
          </div>
        </div>

        <div className="p-6 md:p-8">
          {step === 1 && (
            <div className="space-y-6">
              <p className="text-stone-600">
                Al ejecutar el Cierre de Mes, el sistema calculará automáticamente los Gastos Comunes de todas las unidades, aplicará las multas correspondientes a los morosos y emitirá los recibos de cobro formales. <strong>Esta acción no se puede deshacer.</strong>
              </p>

              <div className="bg-stone-50 p-5 rounded-lg border border-stone-200 space-y-3">
                <h4 className="font-bold text-stone-800 text-sm uppercase tracking-wider mb-2">Resumen de Impacto</h4>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-600">Unidades a facturar:</span>
                  <span className="font-bold text-stone-800">{financialStats.activeUnits} Deptos</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-600">Morosos que recibirán multa:</span>
                  <span className="font-bold text-red-600">{financialStats.delinquencyRate}% del total</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-600">Gastos pendientes por recaudar:</span>
                  <span className="font-bold text-amber-600">{formatCurrency(financialStats.totalPending)}</span>
                </div>
              </div>

              <div className="pt-4 flex items-center gap-4">
                <button 
                  onClick={handleExecute}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors shadow-sm flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                  </svg>
                  Ejecutar Cierre y Emitir Cobros
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-12 h-12 border-4 border-stone-200 border-t-amber-500 rounded-full animate-spin"></div>
              <h3 className="text-xl font-bold text-stone-800">Procesando Cierre...</h3>
              <p className="text-stone-500">Ejecutando cálculos y generando boletas masivas.</p>
            </div>
          )}

          {step === 3 && (
            <div className="py-8 text-center space-y-4">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-stone-800">¡Cierre de Mes Exitoso!</h3>
              <p className="text-stone-600 max-w-md mx-auto">
                Los cobros han sido generados. Los residentes ya pueden ver sus nuevas boletas y deudas actualizadas en sus paneles.
              </p>
              <div className="pt-6">
                <button 
                  onClick={() => setStep(1)}
                  className="px-6 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold rounded-lg transition-colors"
                >
                  Volver al inicio
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CierreMes