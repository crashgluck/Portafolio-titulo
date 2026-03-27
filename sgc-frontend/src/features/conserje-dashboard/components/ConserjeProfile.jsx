import { useNavigate } from 'react-router-dom'
import { APP_ROUTES } from '@app/routes'
import useAuth from '@features/auth/hooks/useAuth'
import { ProfileCard, ActionCard } from '@shared/ui'

const ConserjeProfile = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  if (!user) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="w-8 h-8 border-4 border-stone-200 border-t-emerald-500 rounded-full animate-spin"></div>
      </div>
    )
  }

  const quickActions = [
    {
      title: 'Ingreso Medidores',
      desc: 'Registra el consumo mensual de agua y calefacción.',
      path: APP_ROUTES.conserjeMedidores,
      icon: <span className="text-xl">💧</span>,
      isPrimary: true
    }
  ]

  const displayName = user?.nombre ? `${user.nombre} ${user.apellido || ''}` : user?.email || 'Conserje'

  return (
    <div className="space-y-8">
      <ProfileCard 
        name={displayName}
        role="Personal de Conserjería"
        extraInfo={user?.email}
        status="Turno"
        balance="N/A"
      />

      <div>
        <h3 className="text-lg font-bold text-stone-800 mb-4">Herramientas Operativas</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

export default ConserjeProfile