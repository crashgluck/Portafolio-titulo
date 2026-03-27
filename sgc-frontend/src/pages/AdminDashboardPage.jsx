import DashboardLayout from '@shared/ui/DashboardLayout'
// NUEVO: Usamos el alias @features en lugar de rutas relativas con puntitos
import ResumenFinanciero from '@features/admin-dashboard/components/ResumenFinanciero'
import { adminNavItems } from '@features/admin-dashboard/data/adminDashboardData'

const AdminDashboardPage = () => {
  return (
    <DashboardLayout 
      navItems={adminNavItems} 
      title="Perfil Contabilidad"
    >
      <div className="w-full max-w-7xl mx-auto pb-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-stone-900">Panel Financiero</h2>
          <p className="text-stone-500 mt-1">
            Transparencia financiera y gestión de gastos comunes de la comunidad.
          </p>
        </div>

        <ResumenFinanciero />
      </div>
    </DashboardLayout>
  )
}

export default AdminDashboardPage