const DataTable = ({ columns, data, isLoading = false, emptyMessage = 'No hay registros para mostrar.' }) => {
  const safeData = Array.isArray(data) ? data : []
  const safeColumns = Array.isArray(columns) ? columns : []
  const colSpan = Math.max(1, safeColumns.length)

  return (
    <div className="bg-stone-50 rounded-xl border border-stone-200 shadow-sm overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-stone-100 border-b border-stone-200">
              {safeColumns.map((col) => (
                <th key={col.header} className="py-4 px-6 text-xs sm:text-sm font-bold text-stone-700 uppercase tracking-wider whitespace-nowrap">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-stone-200">
            {isLoading ? (
              <tr>
                <td colSpan={colSpan} className="py-12 text-center text-stone-600">
                  <div className="flex justify-center items-center gap-3">
                    <svg className="animate-spin h-5 w-5 text-amber-700" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span className="font-medium">Cargando datos...</span>
                  </div>
                </td>
              </tr>
            ) : safeData.length === 0 ? (
              <tr>
                <td colSpan={colSpan} className="py-16 text-center">
                  <div className="flex flex-col items-center justify-center text-stone-600">
                    <svg className="w-12 h-12 mb-3 text-amber-700/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-base font-medium text-stone-900">{emptyMessage}</p>
                    <p className="text-sm mt-1">Los nuevos registros apareceran aqui.</p>
                  </div>
                </td>
              </tr>
            ) : (
              safeData.map((row, rowIndex) => (
                <tr key={`${row.periodo}-${rowIndex}`} className="hover:bg-stone-100/70 transition-colors duration-150">
                  {safeColumns.map((col, colIndex) => (
                    <td key={`${col.header}-${colIndex}`} className="py-4 px-6 text-sm text-stone-900">
                      {typeof col.accessor === 'function'
                        ? col.accessor(row)
                        : row[col.accessor] || <span className="text-stone-400 italic text-xs">N/A</span>}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DataTable
