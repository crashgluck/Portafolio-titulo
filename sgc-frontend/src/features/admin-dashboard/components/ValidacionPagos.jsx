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
  listUsersRequest,
  patchPaymentRequest,
} from '@features/condominium-management/api/billing.api'
import { formatCurrencyCLP } from '@shared/lib/format'

const toStatusPayload = (status) => ({
  status,
  validation_date: new Date().toISOString().split('T')[0],
})

const toAbsoluteReceiptUrl = (fileUrl) => {
  if (!fileUrl) {
    return ''
  }

  if (fileUrl.startsWith('http://') || fileUrl.startsWith('https://')) {
    return fileUrl
  }

  const apiOrigin = API_CONFIG.baseUrl.replace(/\/api\/?$/, '')
  return `${apiOrigin}${fileUrl}`
}

const paymentMethodLabel = {
  transfer: 'Transferencia',
  card: 'Tarjeta',
  cash: 'Efectivo',
}

const paymentStatusMeta = {
  pending: {
    label: 'Pendiente',
    badgeClass: 'bg-amber-100 text-amber-800 border border-amber-200',
  },
  approved: {
    label: 'Aprobado',
    badgeClass: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
  },
  rejected: {
    label: 'Rechazado',
    badgeClass: 'bg-rose-100 text-rose-800 border border-rose-200',
  },
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
  const [payments, setPayments] = useState([])
  const [units, setUnits] = useState([])
  const [assignments, setAssignments] = useState([])
  const [receipts, setReceipts] = useState([])
  const [periods, setPeriods] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activePaymentId, setActivePaymentId] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [methodFilter, setMethodFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const loadData = useCallback(async () => {
    if (!accessToken) {
      return
    }

    setLoading(true)
    setError('')

    try {
      const [paymentRows, unitRows, assignmentRows, receiptRows, periodRows, userRows] = await Promise.all([
        listPaymentsRequest(accessToken),
        listUnitsRequest(accessToken),
        listResidentAssignmentsRequest(accessToken),
        listPaymentReceiptsRequest(accessToken),
        listBillingPeriodsRequest(accessToken),
        listUsersRequest(accessToken),
      ])

      setPayments(Array.isArray(paymentRows) ? paymentRows : [])
      setUnits(Array.isArray(unitRows) ? unitRows : [])
      setAssignments(Array.isArray(assignmentRows) ? assignmentRows : [])
      setReceipts(Array.isArray(receiptRows) ? receiptRows : [])
      setPeriods(Array.isArray(periodRows) ? periodRows : [])
      setUsers(Array.isArray(userRows) ? userRows : [])
    } catch (requestError) {
      setError(requestError.message || 'No fue posible cargar la gestion de pagos.')
    } finally {
      setLoading(false)
    }
  }, [accessToken])

  useEffect(() => {
    loadData()
  }, [loadData])

  const unitById = useMemo(() => {
    return units.reduce((acc, unit) => {
      acc[unit.id] = unit
      return acc
    }, {})
  }, [units])

  const primaryAssignmentByUnitId = useMemo(() => {
    return assignments.reduce((acc, assignment) => {
      if (!assignment.is_active) {
        return acc
      }

      const current = acc[assignment.unit]
      if (!current || assignment.is_primary) {
        acc[assignment.unit] = assignment
      }

      return acc
    }, {})
  }, [assignments])

  const userById = useMemo(() => {
    return users.reduce((acc, user) => {
      acc[user.id] = user
      return acc
    }, {})
  }, [users])

  const periodById = useMemo(() => {
    return periods.reduce((acc, period) => {
      acc[period.id] = period
      return acc
    }, {})
  }, [periods])

  const latestReceiptByPaymentId = useMemo(() => {
    return receipts.reduce((acc, receipt) => {
      const current = acc[receipt.payment]
      if (!current || receipt.id > current.id) {
        acc[receipt.payment] = receipt
      }
      return acc
    }, {})
  }, [receipts])

  const paymentRows = useMemo(() => {
    return payments.map((payment) => {
      const unit = unitById[payment.unit]
      const assignment = primaryAssignmentByUnitId[payment.unit]
      const assignedUser = userById[assignment?.user]
      const period = periodById[payment.period]
      const receipt = latestReceiptByPaymentId[payment.id]
      const meta = paymentStatusMeta[payment.status] || {
        label: payment.status || 'Sin estado',
        badgeClass: 'bg-stone-100 text-stone-700 border border-stone-200',
      }

      const residentLabel = assignedUser
        ? `${assignedUser.first_name || ''} ${assignedUser.last_name || ''}`.trim() || assignedUser.email
        : assignment?.user
          ? `Usuario #${assignment.user}`
          : 'Sin asignacion activa'

      return {
        id: payment.id,
        status: payment.status,
        statusLabel: meta.label,
        statusClass: meta.badgeClass,
        amount: payment.amount,
        amountLabel: formatCurrencyCLP(payment.amount),
        paymentDate: payment.payment_date,
        validationDate: payment.validation_date,
        method: payment.payment_method,
        methodLabel: paymentMethodLabel[payment.payment_method] || payment.payment_method,
        unitId: payment.unit,
        unitLabel: unit?.number ? `Depto ${unit.number}` : `Unidad #${payment.unit || '-'}`,
        condominiumId: unit?.condominium || null,
        residentLabel,
        periodLabel: period ? `${period.start_date} - ${period.end_date}` : 'Periodo no informado',
        receipt,
      }
    })
  }, [payments, unitById, primaryAssignmentByUnitId, userById, periodById, latestReceiptByPaymentId])

  const filteredRows = useMemo(() => {
    const normalizedTerm = searchTerm.trim().toLowerCase()

    return paymentRows.filter((row) => {
      if (activeCondominiumId && row.condominiumId !== activeCondominiumId) {
        return false
      }

      if (statusFilter !== 'all' && row.status !== statusFilter) {
        return false
      }

      if (methodFilter !== 'all' && row.method !== methodFilter) {
        return false
      }

      if (!normalizedTerm) {
        return true
      }

      const haystack = `${row.id} ${row.unitLabel} ${row.residentLabel} ${row.periodLabel}`.toLowerCase()
      return haystack.includes(normalizedTerm)
    })
  }, [paymentRows, activeCondominiumId, statusFilter, methodFilter, searchTerm])

  const pendingRows = useMemo(() => filteredRows.filter((row) => row.status === 'pending'), [filteredRows])
  const approvedRows = useMemo(() => filteredRows.filter((row) => row.status === 'approved'), [filteredRows])
  const rejectedRows = useMemo(() => filteredRows.filter((row) => row.status === 'rejected'), [filteredRows])

  const approvedTotal = useMemo(() => {
    return approvedRows.reduce((total, row) => total + Number(row.amount || 0), 0)
  }, [approvedRows])

  const onUpdateStatus = async (paymentId, nextStatus) => {
    setActivePaymentId(paymentId)
    setError('')

    try {
      await patchPaymentRequest(paymentId, toStatusPayload(nextStatus), accessToken)
      await loadData()
    } catch (requestError) {
      setError(requestError.message || 'No fue posible actualizar el estado del pago.')
    } finally {
      setActivePaymentId(null)
    }
  }

  return (
    <div className="space-y-6">
      {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <section className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-stone-900">Contexto de condominio</h3>
            <p className="text-sm text-stone-500">Filtra los pagos por condominio activo para operar mas rapido.</p>
          </div>
          <button
            type="button"
            onClick={() => {
              reloadCondominiums()
              loadData()
            }}
            className="rounded-lg border border-stone-300 px-3 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-100"
          >
            {loading || isLoadingCondominiums ? 'Actualizando...' : 'Actualizar datos'}
          </button>
        </div>
        <select
          value={activeCondominiumId || ''}
          onChange={(event) => setActiveCondominium(event.target.value)}
          className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
        >
          {!condominiums.length && <option value="">Sin condominios disponibles</option>}
          {condominiums.map((condominium) => (
            <option key={condominium.id} value={condominium.id}>
              {condominium.name}
            </option>
          ))}
        </select>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">Pagos visibles</p>
          <p className="mt-1 text-2xl font-extrabold text-stone-900">{filteredRows.length}</p>
          <p className="text-xs text-stone-500">{activeCondominium?.name || 'Todos los condominios'}</p>
        </article>
        <article className="rounded-xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Pendientes</p>
          <p className="mt-1 text-2xl font-extrabold text-amber-800">{pendingRows.length}</p>
          <p className="text-xs text-amber-700">Requieren validacion</p>
        </article>
        <article className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Aprobados</p>
          <p className="mt-1 text-2xl font-extrabold text-emerald-800">{approvedRows.length}</p>
          <p className="text-xs text-emerald-700">Pagos validados</p>
        </article>
        <article className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">Monto aprobado</p>
          <p className="mt-1 text-2xl font-extrabold text-stone-900">{formatCurrencyCLP(approvedTotal)}</p>
          <p className="text-xs text-stone-500">Total acumulado filtrado</p>
        </article>
      </section>

      <section className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
        <div className="grid gap-3 md:grid-cols-4">
          <label className="flex flex-col gap-1 text-sm text-stone-700">
            Estado
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm"
            >
              <option value="all">Todos</option>
              <option value="pending">Pendientes</option>
              <option value="approved">Aprobados</option>
              <option value="rejected">Rechazados</option>
            </select>
          </label>

          <label className="flex flex-col gap-1 text-sm text-stone-700">
            Metodo
            <select
              value={methodFilter}
              onChange={(event) => setMethodFilter(event.target.value)}
              className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm"
            >
              <option value="all">Todos</option>
              <option value="transfer">Transferencia</option>
              <option value="card">Tarjeta</option>
              <option value="cash">Efectivo</option>
            </select>
          </label>

          <label className="md:col-span-2 flex flex-col gap-1 text-sm text-stone-700">
            Buscar por pago, unidad o residente
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Ej: 154, Depto 301, juan@correo.com"
              className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm"
            />
          </label>
        </div>
      </section>

      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="border-b border-stone-200 bg-stone-50 px-5 py-3 text-sm text-stone-600">
          {rejectedRows.length > 0
            ? `Hay ${rejectedRows.length} pagos rechazados en esta vista.`
            : 'No hay pagos rechazados en los filtros actuales.'}
        </div>
        {loading ? (
          <div className="p-12 text-center text-stone-500">Cargando gestion de pagos...</div>
        ) : filteredRows.length === 0 ? (
          <div className="p-12 text-center">
            <h3 className="text-lg font-bold text-stone-700">Sin resultados</h3>
            <p className="text-stone-500 mt-1">Ajusta filtros o cambia el condominio para ver pagos.</p>
          </div>
        ) : (
          <ul className="divide-y divide-stone-200">
            {filteredRows.map((payment) => (
              <li
                key={payment.id}
                className="p-6 hover:bg-stone-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-stone-100 p-3 rounded-lg text-center min-w-[5rem]">
                    <span className="block text-xs font-bold text-stone-400 uppercase">Pago</span>
                    <span className="block text-lg font-bold text-stone-800">#{payment.id}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900 text-lg">{payment.amountLabel}</h4>
                    <p className="text-sm text-stone-600">
                      {payment.unitLabel} - {payment.residentLabel}
                    </p>
                    <p className="text-xs text-stone-500 mt-1">
                      Fecha pago {payment.paymentDate} - Metodo {payment.methodLabel}
                    </p>
                    <p className="text-xs text-stone-500 mt-1">
                      Periodo {payment.periodLabel}
                    </p>
                    <p className="text-xs text-stone-500 mt-1">
                      Validacion: {payment.validationDate || 'Pendiente'}
                    </p>
                    <p className="text-xs text-stone-500 mt-1">
                      Comprobante: {payment.receipt?.original_name || 'Sin archivo'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${payment.statusClass}`}>
                    {payment.statusLabel}
                  </span>
                  <button
                    type="button"
                    disabled={!payment.receipt?.file}
                    onClick={() =>
                      window.open(
                        toAbsoluteReceiptUrl(payment.receipt?.file),
                        '_blank',
                        'noopener,noreferrer',
                      )
                    }
                    className="px-4 py-2 text-sm font-bold text-stone-600 hover:bg-stone-200 bg-stone-100 rounded-lg transition-colors w-full sm:w-auto disabled:opacity-50"
                  >
                    Ver comprobante
                  </button>

                  {payment.status === 'pending' ? (
                    <div className="flex gap-2 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => onUpdateStatus(payment.id, 'rejected')}
                        disabled={activePaymentId === payment.id}
                        className="flex-1 px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 text-sm font-bold rounded-lg transition-colors text-center disabled:opacity-60"
                      >
                        Rechazar
                      </button>
                      <button
                        type="button"
                        onClick={() => onUpdateStatus(payment.id, 'approved')}
                        disabled={activePaymentId === payment.id}
                        className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-lg transition-colors shadow-sm text-center disabled:opacity-60"
                      >
                        Aprobar
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onUpdateStatus(payment.id, 'pending')}
                      disabled={activePaymentId === payment.id}
                      className="px-4 py-2 border border-stone-300 text-stone-700 hover:bg-stone-100 text-sm font-semibold rounded-lg transition-colors text-center disabled:opacity-60"
                    >
                      Marcar pendiente
                    </button>
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
