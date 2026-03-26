import DashboardLayout from '@shared/ui/DashboardLayout'
import useAuth from '@features/auth/hooks/useAuth'
import { UserManagementSection } from '@widgets/superadmin-dashboard'
import { superAdminNavItems } from '@features/superadmin-dashboard/data/superAdminDashboardData'

const SuperAdminDashboardPage = () => {
  const { user } = useAuth()
  const realName = user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email : 'Super Admin'

  return (
    <DashboardLayout
      userRole="Super Administrador"
      userName={realName}
      title="Administracion Central"
      navItems={superAdminNavItems}
    >
      <div className="max-w-7xl mx-auto pb-12">
        <UserManagementSection />
      </div>
    </DashboardLayout>
  )
}

export default SuperAdminDashboardPage
