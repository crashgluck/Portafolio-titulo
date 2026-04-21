import { useCallback, useEffect, useMemo, useState } from 'react'
import useAuth from '@features/auth/hooks/useAuth'
import { API_CONFIG } from '@shared/config/api'
import {
  listPaymentReceiptsRequest,
  listPaymentsRequest,
  listResidentAssignmentsRequest,
  listUnitsRequest,
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

const ValidacionPagos = () => {
  const { accessToken } = useAuth()
  const [payments, setPayments] = useState([])
  const [units, setUnits] = useState([])
  const [assignments, setAssignments] = useState([])
  const [receipts, setReceipts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activePaymentId, setActivePaymentId] = useState(null)

  const loadData = useCallback(async () => {
    if (!accessToken) {
      return
    }

    setLoading(true)
    setError('')

    try {
      const [paymentRows, unitRows, assignmentRows, receiptRows] = await Promise.all([
        listPaymentsRequest(accessToken, { status: 'pending' }),
        listUnitsRequest(accessToken),
        listResidentAssignmentsRequest(accessToken),
        listPaymentReceiptsRequest(accessToken),
      ])

      setPayments(Array.isArray(paymentRows) ? paymentRows : [])
      setUnits(Array.isArray(unitRows) ? unitRows : [])
      setAssignments(Array.isArray(assignmentRows) ? assignmentRows : [])
      setReceipts(Array.isArray(receiptRows) ? receiptRows : [])
    } catch (requestError) {
      setError(requestError.message || 'No fue posible cargar la bandeja de pagos pendientes.')
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

  const latestReceiptByPaymentId = useMemo(() => {
    return receipts.reduce((acc, receipt) => {
      const current = acc[receipt.payment]
      if (!current || receipt.id > current.id) {
        acc[receipt.payment] = receipt
      }
      return acc
    }, {})
  }, [receipts])

  const pendingRows = useMemo(() => {
    return payments.map((payment) => {
      const unit = unitById[payment.unit]
      const assignment = primaryAssignmentByUnitId[payment.unit]
      const receipt = latestReceiptByPaymentId[payment.id]

      return {
        id: payment.id,
        amount: payment.amount,
        paymentDate: payment.payment_date,
        method: payment.payment_method,
        unitLabel: unit?.number ? `Depto ${unit.number}` : `Unidad #${payment.unit || '-'}`,
        residentLabel: assignment?.user ? `Usuario #${assignment.user}` : 'Sin asignacion activa',
        receipt,
      }
    })
  }, [payments, unitById, primaryAssignmentByUnitId, latestReceiptByPaymentId])

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

      <div className="bg-white p-5 rounded-xl shadow-sm border border-stone-200 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-stone-800">Bandeja de Validacion</h3>
          <p className="text-sm text-stone-500 mt-1">
            Revisa comprobantes enviados por residentes y confirma su estado.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-amber-100 text-amber-800 w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl">
            {pendingRows.length}
          </div>
          <button
            type="button"
            onClick={loadData}
            className="text-sm font-semibold text-stone-600 hover:text-stone-900 transition-colors"
          >
            Actualizar
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-stone-500">Cargando pagos pendientes...</div>
        ) : pendingRows.length === 0 ? (
          <div className="p-12 text-center">
            <h3 className="text-lg font-bold text-stone-700">Bandeja al dia</h3>
            <p className="text-stone-500 mt-1">No hay comprobantes pendientes por revisar.</p>
          </div>
        ) : (
          <ul className="divide-y divide-stone-200">
            {pendingRows.map((payment) => (
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
                    <h4 className="font-bold text-stone-900 text-lg">{formatCurrencyCLP(payment.amount)}</h4>
                    <p className="text-sm text-stone-600">
                      {payment.unitLabel} - {payment.residentLabel}
                    </p>
                    <p className="text-xs text-stone-500 mt-1">
                      Fecha {payment.paymentDate} - Metodo {payment.method}
                    </p>
                    <p className="text-xs text-stone-500 mt-1">
                      Comprobante: {payment.receipt?.original_name || 'Sin archivo'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
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
