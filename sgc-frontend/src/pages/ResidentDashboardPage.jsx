import { useNavigate } from 'react-router-dom'
import DashboardLayout from '@shared/ui/DashboardLayout'
import { quickActionRoutes } from '@features/resident-dashboard/components/quickActionRoutes'
import {
  ContactFormSection,
  PaymentFormSection,
  PaymentHistorySection,
  QuickActionsSection,
  ResidentOverviewSection,
} from '@widgets/resident-dashboard'
import {
  paymentHistoryColumns,
  paymentHistoryData,
  residentNavItems,
  residentProfiles,
} from '@features/resident-dashboard/data/dashboardData'

const ResidentDashboardPage = () => {
  const navigate = useNavigate()

  const handleDownloadNotice = () => {
    window.print()
  }

  return (
    <DashboardLayout
      userRole="Residente"
      userName="Juan Perez"
      title="Portal Residente"
      navItems={residentNavItems}
    >
      <div className="max-w-7xl mx-auto pb-12">
        <ResidentOverviewSection profiles={residentProfiles} />

        <QuickActionsSection
          onDownloadNotice={handleDownloadNotice}
          onGoToPayments={() => navigate(quickActionRoutes.payments)}
          onGoToHistory={() => navigate(quickActionRoutes.history)}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 flex flex-col gap-8">
            <PaymentFormSection />
            <ContactFormSection />
          </div>

          <PaymentHistorySection columns={paymentHistoryColumns} data={paymentHistoryData} />
        </div>
      </div>
    </DashboardLayout>
  )
}

export default ResidentDashboardPage
