import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from '@features/auth/guards/ProtectedRoute'
import PublicOnlyRoute from '@features/auth/guards/PublicOnlyRoute'
import LoginPage from '@pages/LoginPage'
import RegisterPage from '@pages/RegisterPage'
import ResidentDashboardPage from '@pages/ResidentDashboardPage'
import ResidentPaymentsPage from '@pages/ResidentPaymentsPage'
import ResidentProfilePage from '@pages/ResidentProfilePage'
import UnauthorizedPage from '@pages/UnauthorizedPage'
import { APP_ROUTES } from './routes'

const AppRouter = () => {
  return (
    <Routes>
      <Route path={APP_ROUTES.home} element={<Navigate to={APP_ROUTES.residentDashboard} replace />} />

      <Route element={<PublicOnlyRoute />}>
        <Route path={APP_ROUTES.login} element={<LoginPage />} />
        <Route path={APP_ROUTES.register} element={<RegisterPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path={APP_ROUTES.residentDashboard} element={<ResidentDashboardPage />} />
        <Route path={APP_ROUTES.residentPayments} element={<ResidentPaymentsPage />} />
        <Route path={APP_ROUTES.residentProfile} element={<ResidentProfilePage />} />
      </Route>

      <Route path={APP_ROUTES.unauthorized} element={<UnauthorizedPage />} />
      <Route path="*" element={<Navigate to={APP_ROUTES.residentDashboard} replace />} />
    </Routes>
  )
}

export default AppRouter
