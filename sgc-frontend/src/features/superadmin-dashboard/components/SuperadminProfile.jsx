import { useNavigate } from 'react-router-dom'
import { APP_ROUTES } from '@app/routes'
import useAuth from '@features/auth/hooks/useAuth'
import { ProfileCard, ActionCard } from '@shared/ui'

const SuperAdminProfile = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  if (!user) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="w-8 h-8 border-4 border-stone-200 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    )
  }

  const realName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email || 'Super Admin'

  const quickActions = [
    {
      title: 'Directorio de Usuarios',
      desc: 'Administra cuentas, roles y accesos de la plataforma.',
      path: APP_ROUTES.superadminUsers,
      icon: <span className="text-xl">👥</span>,
      isPrimary: true
    },
    // --- ESTE ES EL BOTÓN NUEVO ---
    {
      title: 'Crear Nuevo Usuario',
      desc: 'Añade rápidamente un residente, conserje o administrador.',
      path: APP_ROUTES.superadminUsers, // Navega a la misma página
      icon: <span className="text-xl">➕</span>,
      isPrimary: false,
      state: { openCreateModal: true } // <-- AQUÍ VA EL MENSAJE SECRETO
    }
  ]

  return (
    <div className="space-y-8">
      <ProfileCard 
        name={realName}
        role="Super Administrador"
        extraInfo={user?.email}
        status="Activo"
        balance="N/A"
      />

      <div>
        <h3 className="text-lg font-bold text-stone-800 mb-4">Herramientas del Sistema</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <ActionCard
              key={index}
              title={action.title}
              description={action.desc}
              icon={action.icon}
              isPrimary={action.isPrimary}
              onClick={() => {
                // --- ACTUALIZAMOS EL ONCLICK PARA ENVIAR EL STATE ---
                navigate(action.path, { state: action.state })
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default SuperAdminProfile