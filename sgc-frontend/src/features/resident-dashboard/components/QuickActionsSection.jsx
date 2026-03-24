import ActionCard from '@shared/ui/ActionCard'

const iconDownload = (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
)

const iconUpload = (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
    />
  </svg>
)

const iconHistory = (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
    />
  </svg>
)

const QuickActionsSection = ({ onDownloadNotice, onGoToPayments, onGoToHistory }) => {
  return (
    <section className="mb-12">
      <h2 className="text-lg font-bold text-stone-900 mb-5 uppercase tracking-wide flex items-center gap-2">
        <span className="w-2 h-6 bg-amber-600 rounded-sm" />
        Acciones frecuentes
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
        <ActionCard
          title="Descargar aviso"
          description="Genera un PDF con el detalle de tus gastos comunes del mes actual."
          icon={iconDownload}
          onClick={onDownloadNotice}
        />
        <ActionCard
          title="Informar pago"
          description="Sube el comprobante de tu transferencia para validacion."
          icon={iconUpload}
          isPrimary
          onClick={onGoToPayments}
        />
        <ActionCard
          title="Historial de pagos"
          description="Revisa el registro y estado de tus comprobantes anteriores."
          icon={iconHistory}
          onClick={onGoToHistory}
        />
      </div>
    </section>
  )
}

export default QuickActionsSection
