import { useState, useMemo, useEffect, useCallback } from 'react'
import useAuth from '@features/auth/hooks/useAuth'
import useCondominium from '@features/condominium-management/hooks/useCondominium'
import { 
  listPaymentsRequest, 
  listUnitsRequest, 
  listBillingPeriodsRequest 
} from '@features/condominium-management/api/billing.api'
import { formatCurrencyCLP } from '@shared/lib/format'

const CierreMes = () => {
  const { accessToken } = useAuth()
  
  // Extraemos lo necesario del contexto global
  const { 
    condominiums, 
    activeCondominiumId, 
    activeCondominium,
    setActiveCondominium 
  } = useCondominium()
  
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [payments, setPayments] = useState([])
  const [units, setUnits] = useState([])
  const [periods, setPeriods] = useState([])

  // 1. CARGA DE DATOS
  const loadImpactData = useCallback(async () => {
    if (!accessToken || !activeCondominiumId) return
    setLoading(true)
    try {
      const [pData, uData, perData] = await Promise.all([
        listPaymentsRequest(accessToken),
        listUnitsRequest(accessToken),
        listBillingPeriodsRequest(accessToken)
      ])
      setPayments(Array.isArray(pData) ? pData : [])
      setUnits(Array.isArray(uData) ? uData : [])
      setPeriods(Array.isArray(perData) ? perData : [])
    } catch (err) {
      setError('No se pudo cargar el resumen de impacto.')
    } finally {
      setLoading(false)
    }
  }, [accessToken, activeCondominiumId])

  useEffect(() => {
    loadImpactData()
  }, [loadImpactData])

  // 2. CÁLCULOS (Solo para el condominio activo)
  const impactStats = useMemo(() => {
    const condoUnits = units.filter(u => String(u.condominium) === String(activeCondominiumId))
    const condoPayments = payments.filter(p => {
      const unit = units.find(u => u.id === p.unit)
      return unit && String(unit.condominium) === String(activeCondominiumId)
    })

    const pendingPayments = condoPayments.filter(p => p.status === 'pending' || p.status === 'rejected')
    const totalPendingAmount = pendingPayments.reduce((acc, p) => acc + Number(p.amount), 0)
    const unitsWithDebt = new Set(pendingPayments.map(p => p.unit))
    const delinquencyRate = condoUnits.length > 0 
      ? ((unitsWithDebt.size / condoUnits.length) * 100).toFixed(1) 
      : 0

    const currentPeriod = periods.find(p => !p.is_closed) || { name: 'Periodo Actual' }

    return {
      activeUnits: condoUnits.length,
      delinquencyRate,
      totalPending: totalPendingAmount,
      periodLabel: currentPeriod.name
    }
  }, [units, payments, periods, activeCondominiumId])

  const handleExecute = async () => {
    if (!activeCondominiumId) return
    setStep(2)
    try {
      // Simulación de cierre (aquí irá la llamada al backend)
      await new Promise(resolve => setTimeout(resolve, 2500))
      setStep(3)
    } catch (err) {
      setError('Error al procesar el cierre.')
      setStep(1)
    }
  }

  return (
    <div className="max-w-3xl space-y-6 animate-in fade-in">
      
      {/* SECCIÓN 1: SELECTOR DE CONDOMINIO (Igual que en las otras pestañas) */}
      <section className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm">
        <h3 className="font-bold text-stone-900 mb-4 text-sm uppercase tracking-wider">Contexto de Gestión</h3>
        <select
          value={activeCondominiumId || ''}
          onChange={(e) => {
            setActiveCondominium(e.target.value)
            setStep(1) // Reiniciamos el proceso si cambia de edificio
          }}
          className="w-full p-2.5 border border-stone-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-500/30"
        >
          {!condominiums.length && <option value="">Sin condominios disponibles</option>}
          <option value="">Seleccione un condominio para cerrar mes...</option>
          {condominiums.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </section>

      {/* SECCIÓN 2: PROCESO DE CIERRE */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
        
        {/* Cabecera dinámica según el condominio elegido */}
        <div className="px-6 py-5 border-b border-stone-200 bg-stone-900 text-white flex items-center gap-3">
          <div className="p-2 bg-amber-500/20 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-amber-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2.25m0 4.5h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold">
              {activeCondominium ? `Cierre Mensual: ${activeCondominium.name}` : 'Ejecución de Cierre'}
            </h3>
            <p className="text-sm text-stone-400 mt-1">
              {activeCondominium ? impactStats.periodLabel : 'Seleccione un edificio para continuar'}
            </p>
          </div>
        </div>

        <div className="p-6 md:p-8">
          {!activeCondominiumId ? (
            <div className="text-center py-10">
              <p className="text-stone-500 italic">Debe seleccionar un condominio en el panel superior para ver el impacto del cierre.</p>
            </div>
          ) : (
            <>
              {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>}

              {step === 1 && (
                <div className="space-y-6">
                  <p className="text-stone-600 text-sm leading-relaxed">
                    Esta acción calculará automáticamente los Gastos Comunes, aplicará multas y emitirá los cobros para las <strong>{impactStats.activeUnits} unidades</strong> de este edificio.
                  </p>

                  <div className="bg-stone-50 p-6 rounded-xl border border-stone-200 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-stone-400 uppercase">Deptos</span>
                      <span className="text-xl font-bold text-stone-800">{impactStats.activeUnits}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-stone-400 uppercase">Morosidad</span>
                      <span className="text-xl font-bold text-red-600">{impactStats.delinquencyRate}%</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-stone-400 uppercase">Por Recaudar</span>
                      <span className="text-xl font-bold text-amber-600">{formatCurrencyCLP(impactStats.totalPending)}</span>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-stone-100">
                    <button 
                      onClick={handleExecute}
                      disabled={loading || impactStats.activeUnits === 0}
                      className="w-full md:w-auto px-10 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-200 flex items-center justify-center gap-2"
                    >
                      Ejecutar Cierre y Emitir Cobros
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="py-16 text-center space-y-4">
                  <div className="w-12 h-12 border-4 border-stone-100 border-t-amber-500 rounded-full animate-spin mx-auto"></div>
                  <h3 className="text-xl font-bold text-stone-800">Procesando cierre masivo...</h3>
                </div>
              )}

              {step === 3 && (
                <div className="py-10 text-center space-y-6">
                  <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-10 h-10">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-stone-800">¡Cierre Finalizado!</h3>
                  <button onClick={() => setStep(1)} className="px-8 py-2.5 bg-stone-900 text-white font-bold rounded-lg hover:bg-stone-800 transition-colors">
                    Volver
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default CierreMes