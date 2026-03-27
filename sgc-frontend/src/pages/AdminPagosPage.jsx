import DashboardLayout from '@shared/ui/DashboardLayout'
import ValidacionPagos from '@features/admin-dashboard/components/ValidacionPagos'
import { adminNavItems } from '@features/admin-dashboard/data/adminDashboardData'

const AdminPagosPage = () => {
  return (
    <DashboardLayout 
      navItems={adminNavItems} 
      title="Perfil Contabilidad"
    >
      <div className="w-full max-w-5xl mx-auto pb-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-stone-900">Validar Transferencias</h2>
          <p className="text-stone-500 mt-1">
            Aprueba o rechaza los comprobantes de pago enviados por la comunidad.
          </p>
        </div>

        <ValidacionPagos />
      </div>
    </DashboardLayout>
  )
}

export default AdminPagosPage