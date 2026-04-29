import { useState, useEffect, useMemo, useCallback } from 'react'
import useAuth from '@features/auth/hooks/useAuth'
import useCondominium from '@features/condominium-management/hooks/useCondominium'
import { listUnitsRequest } from '@features/condominium-management/api/billing.api'
import { commonExpensesMock } from '../data/adminDashboardData'
import { formatCurrencyCLP } from '@shared/lib/format'

// Importamos las librerías para el PDF
import jsPDF from 'jspdf'
import 'jspdf-autotable'

const EstadoCuenta = () => {
  const { accessToken } = useAuth()
  const {
    condominiums,
    activeCondominiumId,
    activeCondominium,
    isLoading: isLoadingCondos
  } = useCondominium()

  const [units, setUnits] = useState([])
  const [selectedUnitId, setSelectedUnitId] = useState('')
  const [selectedUnitData, setSelectedUnitData] = useState(null)
  const [loadingUnits, setLoadingUnits] = useState(false)
  const [error, setError] = useState('')

  const loadUnits = useCallback(async () => {
    if (!accessToken) return
    setLoadingUnits(true)
    try {
      const data = await listUnitsRequest(accessToken)
      setUnits(Array.isArray(data) ? data : [])
    } catch (err) {
      setUnits([])
    } finally {
      setLoadingUnits(false)
    }
  }, [accessToken])

  useEffect(() => {
    loadUnits()
  }, [loadUnits])

  const availableUnits = useMemo(() => {
    if (!activeCondominiumId) return []
    return units.filter(u => String(u.condominium) === String(activeCondominiumId))
  }, [units, activeCondominiumId])

  useEffect(() => {
    setSelectedUnitId('')
    setSelectedUnitData(null)
  }, [activeCondominiumId])

  const handleSearch = (e) => {
    e.preventDefault()
    if (!selectedUnitId) return
    setError('')
    const found = commonExpensesMock.find(exp => String(exp.unit) === String(selectedUnitId))
    if (found) {
      setSelectedUnitData(found)
    } else {
      setSelectedUnitData(null)
      setError('No se encontraron registros financieros para esta unidad.')
    }
  }

  // --- FUNCIÓN PARA GENERAR EL PDF ---
  const downloadPDF = () => {
    if (!selectedUnitData) return

    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const condoName = activeCondominium?.name || 'Condominio'
    
    // 1. Encabezado y Título
    doc.setFontSize(20)
    doc.setTextColor(40, 40, 40)
    doc.text('ESTADO DE CUENTA', 15, 20)
    
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.text(`Generado el: ${new Date().toLocaleDateString()}`, 15, 26)

    // 2. Información del Condominio y Unidad
    doc.setDrawColor(200, 200, 200)
    doc.line(15, 32, pageWidth - 15, 32)
    
    doc.setFontSize(12)
    doc.setTextColor(0, 0, 0)
    doc.setFont('helvetica', 'bold')
    doc.text('INFORMACIÓN GENERAL', 15, 42)
    
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.text(`Condominio: ${condoName}`, 15, 50)
    doc.text(`Unidad: Depto ${selectedUnitData.unit}`, 15, 56)
    doc.text(`Copropietario: ${selectedUnitData.owner}`, 15, 62)

    // 3. Cuadro de Resumen Financiero
    doc.setFillColor(245, 245, 245)
    doc.rect(130, 42, 65, 20, 'F')
    doc.setFont('helvetica', 'bold')
    doc.text('SALDO PENDIENTE', 135, 48)
    doc.setFontSize(14)
    doc.setTextColor(180, 0, 0) // Rojo para la deuda
    doc.text(formatCurrencyCLP(selectedUnitData.amount), 135, 57)

    // 4. Tabla de Movimientos (Usando Autotable)
    const tableData = [
      ['Marzo 2026', 'Gasto Común - Periodo Actual', formatCurrencyCLP(selectedUnitData.amount), 'Pendiente'],
      ['Febrero 2026', 'Pago Recibido - Transferencia', `+${formatCurrencyCLP(selectedUnitData.amount)}`, 'Aprobado'],
      ['Enero 2026', 'Pago Recibido - Transferencia', `+${formatCurrencyCLP(selectedUnitData.amount)}`, 'Aprobado']
    ]

    doc.autoTable({
      startY: 75,
      head: [['Fecha', 'Descripción', 'Monto', 'Estado']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [40, 40, 40], fontSize: 10 },
      styles: { fontSize: 9, cellPadding: 4 }
    })

    // 5. Pie de página
    const finalY = doc.lastAutoTable.finalY || 150
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text('Este documento es un comprobante informativo generado por el Sistema de Gestión de Condominios (SGC).', pageWidth / 2, finalY + 20, { align: 'center' })

    // Guardar el PDF
    doc.save(`Estado_Cuenta_Depto_${selectedUnitData.unit}.pdf`)
  }

  return (
    <div className="space-y-6">
      {/* Sección de Filtros */}
      <section className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-stone-900">Consulta de Estado Histórico</h3>
          <p className="text-sm text-stone-500">Seleccione la ubicación para generar el informe.</p>
        </div>

        <form onSubmit={handleSearch} className="grid gap-4 md:grid-cols-3 items-end">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Condominio</label>
            <select
              value={activeCondominiumId || ''}
              onChange={(e) => setActiveCondominium(e.target.value)}
              className="w-full p-2.5 border border-stone-300 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-amber-500/30"
            >
              {!condominiums.length ? (
                <option value="">Sin condominios disponibles</option>
              ) : (
                <>
                  <option value="">Seleccione condominio...</option>
                  {condominiums.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </>
              )}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Unidad</label>
            <select
              value={selectedUnitId}
              onChange={(e) => setSelectedUnitId(e.target.value)}
              disabled={!activeCondominiumId || loadingUnits}
              className="w-full p-2.5 border border-stone-300 rounded-lg text-sm bg-white disabled:bg-stone-50"
            >
              <option value="">{!activeCondominiumId ? 'Elija condominio' : 'Seleccione unidad...'}</option>
              {availableUnits.map(u => (
                <option key={u.id} value={u.id}>{u.number ? `Depto ${u.number}` : `Unidad #${u.id}`}</option>
              ))}
            </select>
          </div>

          <button 
            type="submit"
            disabled={!selectedUnitId || isLoadingCondos}
            className="bg-stone-900 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-stone-800 disabled:bg-stone-300 transition-all shadow-sm"
          >
            Ver Historial
          </button>
        </form>
        {error && <p className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">{error}</p>}
      </section>

      {/* Tarjeta de Resultados */}
      {selectedUnitData && (
        <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden animate-in fade-in">
          <div className="bg-stone-900 p-6 text-white flex justify-between items-center">
            <div>
              <h4 className="text-xl font-bold">Resumen de Movimientos</h4>
              <p className="text-stone-400 text-sm">Depto {selectedUnitData.unit} • {selectedUnitData.owner}</p>
            </div>
            {/* BOTÓN CONECTADO A LA FUNCIÓN PDF */}
            <button 
              onClick={downloadPDF}
              className="bg-amber-500 hover:bg-amber-600 text-stone-900 px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-lg"
            >
              Descargar PDF
            </button>
          </div>
          
          <div className="p-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="p-5 bg-stone-50 rounded-xl border border-stone-100">
                   <span className="block text-xs font-bold text-stone-500 uppercase mb-1">Deuda Pendiente</span>
                   <span className="text-3xl font-black text-red-600">
                      {formatCurrencyCLP(selectedUnitData.amount)}
                   </span>
                </div>
                <div className="p-5 bg-stone-50 rounded-xl border border-stone-100">
                   <span className="block text-xs font-bold text-stone-500 uppercase mb-1">Estado de Cuenta</span>
                   <span className={`inline-block mt-1 text-sm font-bold px-3 py-1 rounded-full ${selectedUnitData.status === 'moroso' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {selectedUnitData.status.toUpperCase()}
                   </span>
                </div>
             </div>

             {/* Vista previa de la tabla en la web */}
             <div className="overflow-x-auto">
               <table className="w-full text-left text-sm">
                 <thead>
                   <tr className="border-b border-stone-200 text-stone-400 uppercase text-[10px] font-bold">
                     <th className="py-3">Periodo</th>
                     <th className="py-3">Descripción</th>
                     <th className="py-3">Monto</th>
                     <th className="py-3 text-right">Estado</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-stone-100">
                   <tr className="hover:bg-stone-50 transition-colors">
                     <td className="py-4 font-bold">Marzo 2026</td>
                     <td className="py-4 text-stone-600">Cobro Gasto Común</td>
                     <td className="py-4 font-bold text-red-600">-{formatCurrencyCLP(selectedUnitData.amount)}</td>
                     <td className="py-4 text-right"><span className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs font-bold">Pendiente</span></td>
                   </tr>
                   <tr className="hover:bg-stone-50 transition-colors">
                     <td className="py-4 font-bold">Febrero 2026</td>
                     <td className="py-4 text-stone-600">Pago Recibido</td>
                     <td className="py-4 font-bold text-emerald-600">+{formatCurrencyCLP(selectedUnitData.amount)}</td>
                     <td className="py-4 text-right"><span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-bold">Aprobado</span></td>
                   </tr>
                 </tbody>
               </table>
             </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EstadoCuenta