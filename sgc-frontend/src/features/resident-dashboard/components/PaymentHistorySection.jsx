import DataTable from '@shared/ui/DataTable'

const PaymentHistorySection = ({ columns, data, sectionId = 'seccion-historial' }) => {
  return (
    <section id={sectionId} className="lg:col-span-7">
      <div className="flex justify-between items-end mb-5">
        <h2 className="text-lg font-bold text-stone-900 uppercase tracking-wide flex items-center gap-2">
          <span className="w-2 h-6 bg-stone-900 rounded-sm" />
          Historial de pagos
        </h2>
        <button className="text-sm font-semibold text-amber-700 hover:text-stone-700 transition-colors">Ver todos</button>
      </div>

      <DataTable
        columns={columns}
        data={data}
        isLoading={false}
        emptyMessage="Aun no tienes pagos registrados en este periodo."
      />
    </section>
  )
}

export default PaymentHistorySection
