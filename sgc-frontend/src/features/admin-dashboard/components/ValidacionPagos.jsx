import { useCallback, useEffect, useMemo, useState } from 'react'
import useAuth from '@features/auth/hooks/useAuth'
import useCondominium from '@features/condominium-management/hooks/useCondominium'
import { API_CONFIG } from '@shared/config/api'
import {
  listBillingPeriodsRequest,
  listPaymentReceiptsRequest,
  listPaymentsRequest,
  listResidentAssignmentsRequest,
  listUnitsRequest,
  patchPaymentRequest,
} from '@features/condominium-management/api/billing.api'
import { formatCurrencyCLP } from '@shared/lib/format'

// --- HELPERS DE FORMATO ---
const toStatusPayload = (status) => ({
  status,
  validation_date: new Date().toISOString().split('T')[0],
})

const toAbsoluteReceiptUrl = (fileUrl) => {
  if (!fileUrl) return ''
  if (fileUrl.startsWith('http')) return fileUrl
  const apiOrigin = API_CONFIG.baseUrl.replace(/\/api\/?$/, '')
  return `${apiOrigin}${fileUrl}`
}

const paymentMethodLabel = {
  transfer: 'Transferencia',
  card: 'Tarjeta',
  cash: 'Efectivo',
}

const paymentStatusMeta = {
  pending: { label: 'Pendiente', badgeClass: 'bg-amber-100 text-amber-800 border border-amber-200' },
  approved: { label: 'Aprobado', badgeClass: 'bg-emerald-100 text-emerald-800 border border-emerald-200' },
  rejected: { label: 'Rechazado', badgeClass: 'bg-rose-100 text-rose-800 border border-rose-200' },
}

const ValidacionPagos = () => {
  const { accessToken } = useAuth()
  const {
    condominiums,
    activeCondominiumId,
    activeCondominium,
    isLoading: isLoadingCondominiums,
    setActiveCondominium,
    reloadCondominiums,
  } = useCondominium()

  // --- ESTADOS DE DATOS ---
  const [payments, setPayments] = useState([])
  const [units, setUnits] = useState([])
  const [assignments, setAssignments] = useState([])
  const [receipts, setReceipts] = useState([])
  const [periods, setPeriods] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activePaymentId, setActivePaymentId] = useState(null)


  const [statusFilter, setStatusFilter] = useState('all')
  const [methodFilter, setMethodFilter] = useState('all')
  const [activeUnitId, setActiveUnitId] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')


  const loadData = useCallback(async () => {
    if (!accessToken) return
    setLoading(true)
    setError('')

    try {

      const [paymentRows, unitRows, assignmentRows, receiptRows, periodRows] = await Promise.all([
        listPaymentsRequest(accessToken),
        listUnitsRequest(accessToken),
        listResidentAssignmentsRequest(accessToken),
        listPaymentReceiptsRequest(accessToken),
        listBillingPeriodsRequest(accessToken),
      ])

      setPayments(Array.isArray(paymentRows) ? paymentRows : [])
      setUnits(Array.isArray(unitRows) ? unitRows : [])
      setAssignments(Array.isArray(assignmentRows) ? assignmentRows : [])
      setReceipts(Array.isArray(receiptRows) ? receiptRows : [])
      setPeriods(Array.isArray(periodRows) ? periodRows : [])
    } catch (err) {
      console.error(err)
      setError('Error al cargar la gestión de pagos. Verifique su conexión.')
    } finally {
      setLoading(false)
    }
  }, [accessToken])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Resetear filtro de unidad si cambia el condominio
  useEffect(() => {
    setActiveUnitId('all')
  }, [activeCondominiumId])

  // --- LÓGICA DE FILTRADO Y CRUCE ---
  const unitById = useMemo(() => {
    return units.reduce((acc, u) => ({ ...acc, [u.id]: u }), {})
  }, [units])

  const availableUnits = useMemo(() => {
    if (!activeCondominiumId) return []
    return units.filter(u => String(u.condominium) === String(activeCondominiumId))
  }, [units, activeCondominiumId])

  const paymentRows = useMemo(() => {
    return payments.map((p) => {
      const unit = unitById[p.unit]
      const meta = paymentStatusMeta[p.status] || { label: p.status, badgeClass: 'bg-stone-100' }
      
      return {
        ...p,
        statusLabel: meta.label,
        statusClass: meta.badgeClass,
        amountLabel: formatCurrencyCLP(p.amount),
        unitLabel: unit?.number ? `Depto ${unit.number}` : `Unidad #${p.unit}`,
        condominiumId: unit?.condominium || null,
        methodLabel: paymentMethodLabel[p.payment_method] || p.payment_method,
        receipt: receipts.find(r => r.payment === p.id)
      }
    })
  }, [payments, unitById, receipts])

  const filteredRows = useMemo(() => {
    return paymentRows.filter((row) => {
      if (activeCondominiumId && String(row.condominiumId) !== String(activeCondominiumId)) return false
      if (activeUnitId !== 'all' && String(row.unit) !== String(activeUnitId)) return false
      if (statusFilter !== 'all' && row.status !== statusFilter) return false
      if (methodFilter !== 'all' && row.method !== methodFilter) return false
      
      const term = searchTerm.toLowerCase()
      return row.unitLabel.toLowerCase().includes(term) || String(row.id).includes(term)
    })
  }, [paymentRows, activeCondominiumId, activeUnitId, statusFilter, methodFilter, searchTerm])

  const onUpdateStatus = async (paymentId, nextStatus) => {
    setActivePaymentId(paymentId)
    try {
      await patchPaymentRequest(paymentId, toStatusPayload(nextStatus), accessToken)
      await loadData()
    } catch (err) {
      setError('No se pudo actualizar el estado.')
    } finally {
      setActivePaymentId(null)
    }
  }

  return (
    <div className="space-y-6">
      {error && <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">{error}</div>}

      {/* 1. SELECTOR DE CONDOMINIO (CONTEXTO) */}
      <section className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm">
        <h3 className="font-bold text-stone-900 mb-4">Contexto de Condominio</h3>
        <select
          value={activeCondominiumId || ''}
          onChange={(e) => setActiveCondominium(e.target.value)}
          className="w-full p-2 border border-stone-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-500/30"
        >
          {!condominiums.length && <option value="">Sin condominios disponibles</option>}
          <option value="">Seleccione un edificio...</option>
          {condominiums.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </section>

      {/* 2. FILTROS EN CASCADA */}
      <section className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm grid gap-4 md:grid-cols-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-stone-500 uppercase">Estado</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="p-2 border rounded-lg text-sm">
            <option value="all">Todos</option>
            <option value="pending">Pendientes</option>
            <option value="approved">Aprobados</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-stone-500 uppercase">Unidad / Depto</label>
          <select 
            value={activeUnitId} 
            onChange={(e) => setActiveUnitId(e.target.value)}
            disabled={!activeCondominiumId}
            className="p-2 border rounded-lg text-sm disabled:bg-stone-50"
          >
            <option value="all">Todas las unidades</option>
            {availableUnits.map(u => <option key={u.id} value={u.id}>Depto {u.number}</option>)}
          </select>
        </div>

        <div className="md:col-span-2 flex flex-col gap-1">
          <label className="text-xs font-bold text-stone-500 uppercase">Buscador rápido</label>
          <input 
            type="text" 
            placeholder="Buscar por ID o Depto..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border rounded-lg text-sm"
          />
        </div>
      </section>

      {/* 3. LISTADO DE PAGOS */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-stone-500">Cargando registros...</div>
        ) : filteredRows.length === 0 ? (
          <div className="p-10 text-center text-stone-500">No se encontraron pagos con estos filtros.</div>
        ) : (
          <ul className="divide-y divide-stone-100">
            {filteredRows.map((p) => (
              <li key={p.id} className="p-5 flex flex-col md:flex-row justify-between items-center gap-4 hover:bg-stone-50 transition-colors">
                <div className="flex items-center gap-4 w-full">
                  <div className="bg-stone-100 px-4 py-2 rounded-lg text-center">
                    <span className="block text-[10px] font-bold text-stone-400">ID</span>
                    <span className="font-bold text-stone-700">#{p.id}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900">{p.amountLabel}</h4>
                    <p className="text-sm text-stone-600">{p.unitLabel} • {p.methodLabel}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${p.statusClass}`}>
                    {p.statusLabel}
                  </span>
                  
                  {p.status === 'pending' && (
                    <div className="flex gap-2">
                      <button 
                        onClick={() => onUpdateStatus(p.id, 'approved')}
                        disabled={activePaymentId === p.id}
                        className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors"
                      >
                        Aprobar
                      </button>
                      <button 
                        onClick={() => onUpdateStatus(p.id, 'rejected')}
                        disabled={activePaymentId === p.id}
                        className="border border-red-200 text-red-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-red-50 transition-colors"
                      >
                        Rechazar
                      </button>
                    </div>
                  )}
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