import { useNavigate } from 'react-router-dom'
import { APP_ROUTES } from '@app/routes'
import useAuth from '@features/auth/hooks/useAuth'
// IMPORTAMOS LOS COMPONENTES COMPARTIDOS
import { ProfileCard, ActionCard } from '@shared/ui'

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
      desc: 'Revisa las métricas globales y la morosidad.',
      path: APP_ROUTES.adminResumen,
      icon: <span className="text-xl">📊</span>,
      isPrimary: true // Destacamos esta acción
    },
    {
      title: 'Validar Pagos',
      desc: 'Aprueba o rechaza transferencias pendientes.',
      path: APP_ROUTES.adminPayments,
      icon: <span className="text-xl">✅</span>
    },
    {
      title: 'Estado de Cuenta',
      desc: 'Busca el historial detallado por departamento.',
      path: APP_ROUTES.adminStatement,
      icon: <span className="text-xl">🔍</span>
    },
    {
      title: 'Cierre de Mes',
      desc: 'Ejecuta la facturación y emisión de boletas.',
      path: APP_ROUTES.adminMonthClose,
      icon: <span className="text-xl">⚠️</span>
    }
  ]

  // Formateamos el nombre
  const displayName = user?.nombre ? `${user.nombre} ${user.apellido || ''}` : user?.email || 'Administrador'
  
  return (
    <div className="space-y-8">
      {/* USAMOS EL COMPONENTE COMPARTIDO PROFILECARD */}
      {/* Como el Admin no debe saldo, le pasamos 'Activo' y vacío en balance, o adaptamos los props si el componente lo permite */}
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
          {/* USAMOS EL COMPONENTE COMPARTIDO ACTIONCARD */}
          {quickActions.map((action, index) => (
            <ActionCard
              key={index}
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