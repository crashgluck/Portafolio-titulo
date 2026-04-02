import DashboardLayout from '@shared/ui/DashboardLayout'
import ConserjeProfile from '@features/conserje-dashboard/components/ConserjeProfile'
import { conserjeNavItems } from '@features/conserje-dashboard/data/conserjeDashboardData'

const ConserjeDashboardPage = () => {
  return (
    <DashboardLayout 
      navItems={conserjeNavItems} 
      title="Inicio - Conserjería"
    >
      <div className="w-full max-w-5xl mx-auto pb-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-stone-900">Bienvenido/a</h2>
          <p className="text-stone-500 mt-1">
            Desde aquí puedes acceder a tus herramientas operativas.
          </p>
        </div>


        <ConserjeProfile />
      </div>
    </DashboardLayout>
  )
}

export default ConserjeDashboardPage