import { useState, useMemo, useEffect, useCallback } from 'react'
import useAuth from '@features/auth/hooks/useAuth'
import useCondominium from '@features/condominium-management/hooks/useCondominium'
import DataTable from '@shared/ui/DataTable'
import { listUnitsRequest } from '@features/condominium-management/api/billing.api'
import { meterReadingsMock, readingTypes } from '../data/conserjeDashboardData'

const IngresoMedidores = () => {
  const { accessToken } = useAuth()
  const { condominiums, activeCondominiumId, setActiveCondominium } = useCondominium()

  const [readings, setReadings] = useState(meterReadingsMock)
  const [units, setUnits] = useState([])
  const [loadingUnits, setLoadingUnits] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [selectedUnitId, setSelectedUnitId] = useState('')
  const [type, setType] = useState(readingTypes[0].value)
  const [currentReading, setCurrentReading] = useState('')

  const loadUnits = useCallback(async () => {
    if (!accessToken) return
    setLoadingUnits(true)
    setError('')

    try {
      const data = await listUnitsRequest(accessToken)
      setUnits(Array.isArray(data) ? data : [])
    } catch (requestError) {
      setUnits([])
      setError(requestError.message || 'No se pudieron cargar las unidades.')
    } finally {
      setLoadingUnits(false)
    }
  }, [accessToken])

  useEffect(() => {
    loadUnits()
  }, [loadUnits])

  const availableUnits = useMemo(() => {
    if (!activeCondominiumId) return []
    return units.filter((unit) => String(unit.condominium) === String(activeCondominiumId))
  }, [units, activeCondominiumId])

  useEffect(() => {
    setSelectedUnitId('')
  }, [activeCondominiumId])

  const handleSubmit = (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (!activeCondominiumId) {
      setError('Debes seleccionar un condominio antes de registrar lecturas.')
      return
    }

    if (!selectedUnitId || !currentReading) {
      setError('Completa la unidad y la lectura actual para continuar.')
      return
    }

    const unitObject = units.find((unit) => String(unit.id) === String(selectedUnitId))
    const unitLabel = unitObject?.number ? `Depto ${unitObject.number}` : `Unidad #${selectedUnitId}`

    const previousReading = Math.max(0, Number(currentReading) - Math.floor(Math.random() * 20 + 1))
    const consumption = Number(currentReading) - previousReading

    const newReading = {
      id: `lec-${Date.now()}`,
      unit: unitLabel,
      type,
      previousReading,
      currentReading: Number(currentReading),
      consumption,
      dateRecorded: new Date().toISOString().split('T')[0],
      status: 'registrado',
    }

    setReadings((previous) => [newReading, ...previous])
    setSelectedUnitId('')
    setCurrentReading('')
    setSuccess('Lectura registrada correctamente.')
  }

  const readingColumns = [
    { header: 'Unidad', accessor: 'unit' },
    { header: 'Servicio', accessor: 'type' },
    { header: 'Lectura anterior', accessor: 'previousReading' },
    { header: 'Lectura actual', accessor: (row) => <span className="font-bold text-emerald-700">{row.currentReading}</span> },
    { header: 'Consumo', accessor: (row) => <span className="font-bold text-amber-700">{row.consumption}</span> },
    { header: 'Fecha', accessor: 'dateRecorded' },
    {
      header: 'Accion',
      accessor: (row) => (
        <button
          type="button"
          onClick={() => setReadings((previous) => previous.filter((item) => item.id !== row.id))}
          className="rounded-md border border-red-200 px-3 py-1 text-xs font-semibold text-red-700 hover:bg-red-50"
        >
          Eliminar
        </button>
      ),
    },
  ]

  return (
    <div className="space-y-8 animate-fade-in-up">
      <section className="surface-panel flex flex-col items-start justify-between gap-4 p-5 md:flex-row md:items-center">
        <div>
          <h3 className="mb-1 text-sm font-bold uppercase tracking-wider text-stone-900">Ubicacion de trabajo</h3>
          <p className="text-xs text-stone-500">Selecciona el edificio donde estas registrando medidores.</p>
        </div>
        <select
          value={activeCondominiumId || ''}
          onChange={(event) => setActiveCondominium(event.target.value)}
          className="input-base w-full md:w-72"
        >
          <option value="">Seleccione edificio...</option>
          {condominiums.map((condominium) => (
            <option key={condominium.id} value={condominium.id}>
              {condominium.name}
            </option>
          ))}
        </select>
      </section>

      <section className={`surface-panel p-6 transition-opacity ${!activeCondominiumId ? 'pointer-events-none opacity-60' : 'opacity-100'}`}>
        <div className="mb-4">
          <h3 className="text-lg font-bold text-stone-800">Nueva lectura</h3>
          <p className="text-sm text-stone-500">El consumo se calcula automaticamente usando la lectura anterior.</p>
        </div>

        {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{error}</div>}
        {success && <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">{success}</div>}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-[180px_220px_1fr_auto]">
          <div>
            <label className="mb-1 block text-sm font-semibold text-stone-700">Unidad</label>
            <select
              value={selectedUnitId}
              onChange={(event) => setSelectedUnitId(event.target.value)}
              disabled={loadingUnits}
              className="input-base"
            >
              <option value="">Seleccionar...</option>
              {availableUnits.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.number ? `Depto ${unit.number}` : `Unidad #${unit.id}`}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-stone-700">Servicio</label>
            <select value={type} onChange={(event) => setType(event.target.value)} className="input-base">
              {readingTypes.map((readingType) => (
                <option key={readingType.value} value={readingType.value}>
                  {readingType.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-stone-700">Lectura actual</label>
            <input
              type="number"
              placeholder="Ej: 462"
              value={currentReading}
              onChange={(event) => setCurrentReading(event.target.value)}
              className="input-base font-mono"
            />
          </div>

          <div className="flex items-end">
            <button type="submit" className="btn-primary w-full bg-emerald-600 hover:bg-emerald-700 md:w-auto">
              Guardar
            </button>
          </div>
        </form>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-md font-bold text-stone-900">Registros del mes</h3>
          <span className="rounded-full bg-stone-200 px-3 py-1 text-xs font-bold text-stone-600">{readings.length} ingresos</span>
        </div>

        <DataTable
          columns={readingColumns}
          data={readings}
          emptyMessage="No hay lecturas registradas."
          rowKey="id"
          title="Registros de medidores"
        />
      </section>
    </div>
  )
}

export default IngresoMedidores
