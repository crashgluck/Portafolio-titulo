import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from '@features/auth/guards/ProtectedRoute'
import PublicOnlyRoute from '@features/auth/guards/PublicOnlyRoute'
import HomeRedirect from '@features/auth/guards/HomeRedirect'
import { USER_ROLES } from '@features/auth/model/auth.constants'

// Imports de páginas
import LoginPage from '@pages/LoginPage'
import RegisterPage from '@pages/RegisterPage'

import ResidentDashboardPage from '@pages/ResidentDashboardPage'
import ResidentPaymentsPage from '@pages/ResidentPaymentsPage'
import ResidentProfilePage from '@pages/ResidentProfilePage'

import ConserjeDashboardPage from '@pages/ConserjeDashboardPage'
import ConserjeMedidoresPage from '@pages/ConserjeMedidoresPage'

import SuperAdminDashboardPage from '@pages/SuperAdminDashboardPage'
import SuperAdminUsersPage from '@pages/SuperAdminUsersPage'

import UnauthorizedPage from '@pages/UnauthorizedPage'

import AdminDashboardPage from '@pages/AdminDashboardPage'
import AdminResumenPage from '@pages/AdminResumenPage'
import AdminPagosPage from '@pages/AdminPagosPage'
import AdminEstadoCuentaPage from '@pages/AdminEstadoCuentaPage'
import AdminCierreMesPage from '@pages/AdminCierreMesPage'

import { APP_ROUTES } from './routes'

const AppRouter = () => {
  return (
    <Routes>
      <Route path={APP_ROUTES.home} element={<HomeRedirect />} />

      <Route element={<PublicOnlyRoute />}>
        <Route path={APP_ROUTES.login} element={<LoginPage />} />
        <Route path={APP_ROUTES.register} element={<RegisterPage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={[USER_ROLES.residente]} />}>
        <Route path={APP_ROUTES.residentDashboard} element={<ResidentDashboardPage />} />
        <Route path={APP_ROUTES.residentPayments} element={<ResidentPaymentsPage />} />
        <Route path={APP_ROUTES.residentProfile} element={<ResidentProfilePage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={[USER_ROLES.admin]} />}>
        <Route path={APP_ROUTES.adminDashboard} element={<AdminDashboardPage />} />
        <Route path={APP_ROUTES.adminResumen} element={<AdminResumenPage />} />
        <Route path={APP_ROUTES.adminPayments} element={<AdminPagosPage />} />
        <Route path={APP_ROUTES.adminStatement} element={<AdminEstadoCuentaPage />} />
        <Route path={APP_ROUTES.adminMonthClose} element={<AdminCierreMesPage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={[USER_ROLES.conserje]} />}>
        <Route path={APP_ROUTES.conserjeDashboard} element={<ConserjeDashboardPage />} />
        <Route path={APP_ROUTES.conserjeMedidores} element={<ConserjeMedidoresPage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={[USER_ROLES.superadmin]} />}>
        <Route path={APP_ROUTES.superadminDashboard} element={<SuperAdminDashboardPage />} />
        <Route path={APP_ROUTES.superadminUsers} element={<SuperAdminUsersPage />} />
      </Route>

      <Route path={APP_ROUTES.unauthorized} element={<UnauthorizedPage />} />
      <Route path="*" element={<Navigate to={APP_ROUTES.home} replace />} />
    </Routes>
  )
}

export default AppRouter