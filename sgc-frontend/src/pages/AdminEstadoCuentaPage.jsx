import DashboardLayout from '@shared/ui/DashboardLayout'
import EstadoCuenta from '@features/admin-dashboard/components/EstadoCuenta'
import { adminNavItems } from '@features/admin-dashboard/data/adminDashboardData'

const AdminEstadoCuentaPage = () => {
  return (
    <DashboardLayout 
      navItems={adminNavItems} 
      title="Perfil Contabilidad"
    >
      <div className="w-full max-w-5xl mx-auto pb-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-stone-900">Estado de Cuenta por Unidad</h2>
          <p className="text-stone-500 mt-1">
            Busca un departamento para revisar su deuda acumulada y el historial de pagos.
          </p>
        </div>

        <EstadoCuenta />
      </div>
    </DashboardLayout>
  )
}

export default AdminEstadoCuentaPage