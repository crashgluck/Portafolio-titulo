import { useNavigate } from 'react-router-dom'
import { APP_ROUTES } from '@app/routes'
import useAuth from '@features/auth/hooks/useAuth'
import { ActionCard, ProfileCard } from '@shared/ui'

const AdminProfile = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  if (!user) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="w-8 h-8 border-4 border-stone-200 border-t-amber-500 rounded-full animate-spin"></div>
      </div>
    )
  }

  const quickActions = [
    {
      title: 'Resumen Financiero',
      desc: 'Revisa metricas globales y morosidad.',
      path: APP_ROUTES.adminResumen,
      icon: <span className="text-xl">RF</span>,
      isPrimary: true,
    },
    {
      title: 'Validar Pagos',
      desc: 'Aprueba o rechaza transferencias pendientes.',
      path: APP_ROUTES.adminPayments,
      icon: <span className="text-xl">VP</span>,
    },
    {
      title: 'Estado de Cuenta',
      desc: 'Consulta el historial por departamento.',
      path: APP_ROUTES.adminStatement,
      icon: <span className="text-xl">EC</span>,
    },
    {
      title: 'Cierre de Mes',
      desc: 'Ejecuta la facturacion mensual.',
      path: APP_ROUTES.adminMonthClose,
      icon: <span className="text-xl">CM</span>,
    },
    {
      title: 'Condominios',
      desc: 'Gestiona unidades, residentes y espacios.',
      path: APP_ROUTES.adminCondominiums,
      icon: <span className="text-xl">CO</span>,
    },
  ]

  const displayName =
    `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || user?.email || 'Administrador'

  return (
    <div className="space-y-8">
      <ProfileCard
        name={displayName}
        role="Contabilidad y Finanzas"
        extraInfo={user?.email}
        status="Activo"
        balance="N/A"
      />

      <div>
        <h3 className="text-lg font-bold text-stone-800 mb-4">Accesos Directos</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <ActionCard
              key={action.title}
              title={action.title}
              description={action.desc}
              icon={action.icon}
              isPrimary={action.isPrimary}
              onClick={() => navigate(action.path)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default AdminProfile
