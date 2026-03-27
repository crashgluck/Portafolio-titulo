import DashboardLayout from '@shared/ui/DashboardLayout'
import CierreMes from '@features/admin-dashboard/components/CierreMes'
import { adminNavItems } from '@features/admin-dashboard/data/adminDashboardData'

const AdminCierreMesPage = () => {
  return (
    <DashboardLayout 
      navItems={adminNavItems} 
      title="Perfil Contabilidad"
    >
      <div className="w-full max-w-5xl mx-auto pb-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-stone-900">Proceso de Facturación</h2>
          <p className="text-stone-500 mt-1">
            Administra el cierre contable y la emisión masiva de gastos comunes.
          </p>
        </div>

        <CierreMes />
      </div>
    </DashboardLayout>
  )
}

export default AdminCierreMesPage