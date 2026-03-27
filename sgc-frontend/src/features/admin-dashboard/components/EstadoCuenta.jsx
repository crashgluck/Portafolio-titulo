import { useState } from 'react'
import { commonExpensesMock } from '../data/adminDashboardData'

const EstadoCuenta = () => {
  const [searchUnit, setSearchUnit] = useState('')
  const [selectedUnit, setSelectedUnit] = useState(null)
  const [error, setError] = useState('')

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0
    }).format(amount)
  }

  // Simulamos la búsqueda en la base de datos
  const handleSearch = (e) => {
    e.preventDefault()
    setError('')
    
    if (!searchUnit.trim()) return

    const found = commonExpensesMock.find(exp => exp.unit === searchUnit)
    if (found) {
      setSelectedUnit(found)
    } else {
      setSelectedUnit(null)
      setError('No se encontró el departamento. Intente con "101", "201", etc.')
    }
  }

  return (
    <div className="space-y-6">
      {/* Buscador de Departamento */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-sm font-semibold text-stone-700 mb-1">
              Buscar por Número de Departamento
            </label>
            <input
              type="text"
              placeholder="Ej: 201"
              value={searchUnit}
              onChange={(e) => setSearchUnit(e.target.value)}
              className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
            />
          </div>
          <button 
            type="submit"
            className="w-full sm:w-auto px-6 py-2 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-lg transition-colors"
          >
            Buscar Historial
          </button>
        </form>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>

      {/* Pantalla vacía (antes de buscar) */}
      {!selectedUnit && !error && (
        <div className="bg-stone-50 border border-stone-200 border-dashed rounded-xl p-12 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto text-stone-400 mb-3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
          </svg>
          <h3 className="text-lg font-bold text-stone-600">Busque un departamento</h3>
          <p className="text-stone-500 text-sm">Ingrese el número de la unidad arriba para ver su historial completo.</p>
        </div>
      )}

      {/* Resultados del Historial (Lo que antes era el Modal) */}
      {selectedUnit && (
        <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-stone-200 bg-stone-900 text-white flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold">Estado de Cuenta Histórico</h3>
              <p className="text-sm text-stone-300 mt-1">Depto {selectedUnit.unit} - {selectedUnit.owner}</p>
            </div>
            <button className="px-4 py-2 bg-stone-700 hover:bg-stone-600 text-white text-sm font-bold rounded-lg transition-colors shadow-sm">
              Descargar PDF
            </button>
          </div>

          <div className="p-6">
            <div className="bg-stone-50 rounded-lg p-5 mb-8 flex justify-between items-center border border-stone-200">
              <div>
                <span className="block text-sm font-bold text-stone-500 uppercase tracking-wider mb-1">Deuda Acumulada Actual</span>
                {selectedUnit.status === 'moroso' ? (
                  <span className="text-3xl font-bold text-red-600">{formatCurrency(selectedUnit.amount * 2)}</span>
                ) : (
                  <span className="text-3xl font-bold text-emerald-600">$0</span>
                )}
              </div>
            </div>

            <h4 className="text-sm font-bold text-stone-400 uppercase tracking-wider mb-4 border-b border-stone-100 pb-2">Movimientos del Año</h4>
            
            <div className="space-y-3">
              {/* Mes Actual */}
              <div className="flex justify-between items-center p-4 border-l-4 border-amber-500 bg-white shadow-sm border-y border-r border-stone-100 rounded-r-lg hover:bg-stone-50 transition-colors">
                <div>
                  <span className="font-bold text-stone-800 text-lg block">Marzo 2026</span>
                  <span className="text-sm font-medium text-amber-600">Cobro Emitido (Vence: {selectedUnit.dueDate})</span>
                </div>
                <span className="font-bold text-stone-800 text-lg">-{formatCurrency(selectedUnit.amount)}</span>
              </div>

              {/* Meses Anteriores Simulados */}
              <div className="flex justify-between items-center p-4 border-l-4 border-emerald-500 bg-white shadow-sm border-y border-r border-stone-100 rounded-r-lg hover:bg-stone-50 transition-colors">
                <div>
                  <span className="font-bold text-stone-800 text-lg block">Febrero 2026</span>
                  <span className="text-sm font-medium text-emerald-600">Pagado con Transferencia</span>
                </div>
                <span className="font-bold text-stone-800 text-lg">+{formatCurrency(selectedUnit.amount)}</span>
              </div>

              <div className="flex justify-between items-center p-4 border-l-4 border-emerald-500 bg-white shadow-sm border-y border-r border-stone-100 rounded-r-lg hover:bg-stone-50 transition-colors">
                <div>
                  <span className="font-bold text-stone-800 text-lg block">Enero 2026</span>
                  <span className="text-sm font-medium text-emerald-600">Pagado con Transferencia</span>
                </div>
                <span className="font-bold text-stone-800 text-lg">+{formatCurrency(selectedUnit.amount * 0.95)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EstadoCuenta