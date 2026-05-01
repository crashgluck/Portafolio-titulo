import DashboardLayout from '@shared/ui/DashboardLayout'
import { ContactFormSection, ResidentOverviewSection } from '@widgets/resident-dashboard'
import { residentNavItems, residentProfiles } from '@features/resident-dashboard/data/dashboardData'
import useAuth from '@features/auth/hooks/useAuth'

const ResidentProfilePage = () => {
  const { user } = useAuth()
  const realName = user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email : 'Residente'
  const profile = {
    ...residentProfiles[0],
    id: user?.id || residentProfiles[0]?.id || 1,
    name: realName,
    extraInfo: user?.email || residentProfiles[0]?.extraInfo || '',
  }

  return (
    <DashboardLayout
      userRole="Residente"
      userName={realName}
      title="Mi perfil"
      navItems={residentNavItems}
    >
      <div className="max-w-5xl mx-auto pb-12">
        <ResidentOverviewSection profiles={[profile]} />
        <ContactFormSection />
      </div>
    </DashboardLayout>
  )
}

export default ResidentProfilePage
