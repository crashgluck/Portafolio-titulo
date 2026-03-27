import { useState } from 'react'
import { meterReadingsMock, readingTypes } from '../data/conserjeDashboardData'

const IngresoMedidores = () => {
  // Estado para la tabla (cargamos los datos falsos iniciales)
  const [readings, setReadings] = useState(meterReadingsMock)

  // Estado para el formulario
  const [unit, setUnit] = useState('')
  const [type, setType] = useState(readingTypes[0].value)
  const [currentReading, setCurrentReading] = useState('')

  // Simulación de guardar la lectura
  const handleSubmit = (e) => {
    e.preventDefault()

    if (!unit || !currentReading) {
      alert('Por favor ingrese el departamento y la lectura.')
      return
    }

    // Simulamos que el backend nos devuelve el consumo calculando (Lectura actual - Lectura anterior)
    // Para el demo, inventamos una lectura anterior un poco menor a la ingresada.
    const prevMock = Math.max(0, Number(currentReading) - Math.floor(Math.random() * 20 + 1))
    const consumption = Number(currentReading) - prevMock

    const newReading = {
      id: `lec-new-${Date.now()}`,
      unit: unit,
      type: type,
      previousReading: prevMock,
      currentReading: Number(currentReading),
      consumption: consumption,
      // Usamos la fecha de hoy para el registro
      dateRecorded: new Date().toISOString().split('T')[0],
      status: 'registrado'
    }

    // Agregamos a la lista y limpiamos el formulario para el siguiente depto
    setReadings([newReading, ...readings])
    setUnit('')
    setCurrentReading('')
    
    // Dejamos el foco en el input del departamento para escribir rápido el siguiente
    document.getElementById('unit-input').focus()
  }

  return (
    <div className="space-y-8">
      
      {/* --- FORMULARIO DE INGRESO RÁPIDO --- */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-stone-800">Nueva Lectura</h3>
          <p className="text-sm text-stone-500">Ingrese los datos del medidor. El sistema calculará el consumo automáticamente.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="w-full md:w-32">
            <label className="block text-sm font-semibold text-stone-700 mb-1">Depto</label>
            <input
              id="unit-input"
              type="text"
              placeholder="Ej: 101"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
            />
          </div>

          <div className="w-full md:w-48">
            <label className="block text-sm font-semibold text-stone-700 mb-1">Servicio</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all bg-white"
            >
              {readingTypes.map(rt => (
                <option key={rt.value} value={rt.value}>{rt.label}</option>
              ))}
            </select>
          </div>

          <div className="flex-1 w-full">
            <label className="block text-sm font-semibold text-stone-700 mb-1">Lectura Actual en Medidor</label>
            <input
              type="number"
              placeholder="Ej: 462"
              value={currentReading}
              onChange={(e) => setCurrentReading(e.target.value)}
              className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all font-mono"
            />
          </div>

          <button 
            type="submit"
            className="w-full md:w-auto px-8 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors shadow-sm whitespace-nowrap"
          >
            Guardar
          </button>
        </form>
      </div>

      {/* --- TABLA DE LECTURAS REGISTRADAS --- */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-200 bg-stone-50 flex justify-between items-center">
          <h3 className="text-md font-bold text-stone-800">Registros del Mes</h3>
          <span className="text-xs font-bold bg-stone-200 text-stone-600 px-3 py-1 rounded-full">
            {readings.length} Ingresos
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-100/50 text-stone-500 text-xs uppercase tracking-wider border-b border-stone-200">
                <th className="px-6 py-4 font-semibold">Depto</th>
                <th className="px-6 py-4 font-semibold">Servicio</th>
                <th className="px-6 py-4 font-semibold">Lec. Anterior</th>
                <th className="px-6 py-4 font-semibold text-emerald-700">Lec. Actual</th>
                <th className="px-6 py-4 font-semibold text-amber-600">Consumo Calculado</th>
                <th className="px-6 py-4 font-semibold">Fecha</th>
                <th className="px-6 py-4 font-semibold text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {readings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-stone-500">No hay lecturas registradas.</td>
                </tr>
              ) : (
                readings.map((reading) => (
                  <tr key={reading.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-stone-800">{reading.unit}</td>
                    <td className="px-6 py-4 text-sm text-stone-600">{reading.type}</td>
                    <td className="px-6 py-4 text-sm font-mono text-stone-400">{reading.previousReading}</td>
                    <td className="px-6 py-4 text-sm font-mono font-bold text-emerald-600">{reading.currentReading}</td>
                    <td className="px-6 py-4 text-sm font-bold text-amber-600">
                      {reading.consumption} {reading.type === 'Agua Caliente' ? 'm³' : 'kWh'}
                    </td>
                    <td className="px-6 py-4 text-sm text-stone-500">{reading.dateRecorded}</td>
                    <td className="px-6 py-4 text-sm text-right">
                      <button 
                        className="text-stone-400 hover:text-red-500 transition-colors"
                        title="Eliminar registro"
                        onClick={() => setReadings(readings.filter(r => r.id !== reading.id))}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default IngresoMedidores