import DashboardLayout from '@shared/ui/DashboardLayout'
import { PaymentFormSection, PaymentHistorySection } from '@widgets/resident-dashboard'
import {
  paymentHistoryColumns,
  paymentHistoryData,
  residentNavItems,
} from '@features/resident-dashboard/data/dashboardData'

const ResidentPaymentsPage = () => {
  return (
    <DashboardLayout
      userRole="Residente"
      userName="Juan Perez"
      title="Pagos"
      navItems={residentNavItems}
    >
      <div className="max-w-7xl mx-auto pb-12">
        <header className="mb-8 mt-2">
          <h1 className="text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight">Gestion de pagos</h1>
          <p className="text-stone-600 mt-2 text-base">Administra tus transferencias y revisa el estado de tus comprobantes.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5">
            <PaymentFormSection />
          </div>
          <PaymentHistorySection sectionId="historial" columns={paymentHistoryColumns} data={paymentHistoryData} />
        </div>
      </div>
    </DashboardLayout>
  )
}

export default ResidentPaymentsPage
