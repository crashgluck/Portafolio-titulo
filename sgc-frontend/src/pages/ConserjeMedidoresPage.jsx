import DashboardLayout from '@shared/ui/DashboardLayout'
import IngresoMedidores from '@features/conserje-dashboard/components/IngresoMedidores'
import { conserjeNavItems } from '@features/conserje-dashboard/data/conserjeDashboardData'

const ConserjeMedidoresPage = () => {
  return (
    <DashboardLayout 
      navItems={conserjeNavItems} 
      title="Perfil Conserjería"
    >
      <div className="w-full max-w-5xl mx-auto pb-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-stone-900">Ronda de Medidores</h2>
          <p className="text-stone-500 mt-1">
            Ingresa las lecturas mensuales. El sistema calculará el consumo y lo enviará a contabilidad.
          </p>
        </div>

        {/* Aquí vive ahora el formulario */}
        <IngresoMedidores />
      </div>
    </DashboardLayout>
  )
}

export default ConserjeMedidoresPage