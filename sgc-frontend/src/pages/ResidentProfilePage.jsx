import DashboardLayout from '@shared/ui/DashboardLayout'
import { ContactFormSection, ResidentOverviewSection } from '@widgets/resident-dashboard'
import { residentNavItems, residentProfiles } from '@features/resident-dashboard/data/dashboardData'

const ResidentProfilePage = () => {
  return (
    <DashboardLayout
      userRole="Residente"
      userName="Juan Perez"
      title="Mi perfil"
      navItems={residentNavItems}
    >
      <div className="max-w-5xl mx-auto pb-12">
        <ResidentOverviewSection profiles={residentProfiles.slice(0, 1)} />
        <ContactFormSection />
      </div>
    </DashboardLayout>
  )
}

export default ResidentProfilePage
