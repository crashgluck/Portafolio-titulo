import { useNavigate } from 'react-router-dom'
import DashboardLayout from '@shared/ui/DashboardLayout'
import { quickActionRoutes } from '@features/resident-dashboard/components/quickActionRoutes'
import {
  ContactFormSection,
  PaymentHistorySection,
  QuickActionsSection,
  ResidentOverviewSection,
} from '@widgets/resident-dashboard'

// 1. ELIMINAMOS 'residentProfiles' DE ESTA IMPORTACIÓN
import {
  paymentHistoryColumns,
  paymentHistoryData,
  residentNavItems,
} from '@features/resident-dashboard/data/dashboardData'

// 2. IMPORTAMOS EL HOOK DE AUTENTICACIÓN
import useAuth from '@features/auth/hooks/useAuth'

const ResidentDashboardPage = () => {
  const navigate = useNavigate()
  
  // 3. EXTRAEMOS EL USUARIO REAL DE LA SESIÓN
  const { user } = useAuth()

  // 4. CONSTRUIMOS LOS DATOS REALES
  // Si 'user' existe, armamos su nombre completo. Si no, mostramos un texto de carga.
  const realName = user ? `${user.first_name} ${user.last_name}` : 'Cargando perfil...'

  // Creamos la estructura de datos que tu componente <ResidentOverviewSection> espera leer,
  // pero ahora inyectando las variables reales de Django (user.email, realName, etc.)
  const dynamicProfileData = [{
    id: user?.id || 1,
    name: realName,
    role: 'Residente', 
    extraInfo: user?.email || 'Sin correo registrado',
    status: 'Al día', // Más adelante esto vendrá de la tabla GastoComun
    balance: '$0'     // Más adelante esto vendrá de la tabla Departamento
  }]

  const handleDownloadNotice = () => {
    window.print()
  }

  return (
    <DashboardLayout
      userRole="Residente"
      userName={realName} // <-- Inyectamos el nombre real en el Layout (Barra superior)
      title="Portal Residente"
      navItems={residentNavItems}
    >
      <div className="max-w-7xl mx-auto pb-12">
        
        {/* 5. INYECTAMOS LOS DATOS REALES EN LA TARJETA PRINCIPAL */}
        <ResidentOverviewSection profiles={dynamicProfileData} />

        <QuickActionsSection
          onDownloadNotice={handleDownloadNotice}
          onGoToPayments={() => navigate(quickActionRoutes.payments)}
          onGoToHistory={() => navigate(quickActionRoutes.history)}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 flex flex-col gap-8">
            <section className="bg-white/95 p-6 md:p-8 rounded-2xl border border-stone-200 shadow-sm">
              <h2 className="text-xl font-bold text-stone-900 uppercase tracking-wide mb-2 border-b border-stone-200 pb-4">
                Informar pago
              </h2>
              <p className="text-sm text-stone-600 mt-4">
                Para registrar pagos y comprobantes, usa el modulo de pagos conectado al backend.
              </p>
              <button
                type="button"
                onClick={() => navigate(quickActionRoutes.payments)}
                className="mt-4 rounded-lg bg-stone-900 px-4 py-2 text-sm font-semibold text-stone-50 hover:bg-stone-800"
              >
                Ir a Pagos
              </button>
            </section>
            <ContactFormSection />
          </div>

          <PaymentHistorySection columns={paymentHistoryColumns} data={paymentHistoryData} />
        </div>
      </div>
    </DashboardLayout>
  )
}

export default ResidentDashboardPage
