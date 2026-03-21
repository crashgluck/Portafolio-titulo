import { Navigate, Route, Routes } from 'react-router-dom'
import ResidentDashboardPage from '@pages/ResidentDashboardPage'
import ResidentPaymentsPage from '@pages/ResidentPaymentsPage'
import ResidentProfilePage from '@pages/ResidentProfilePage'
import { APP_ROUTES } from './routes'

const AppRouter = () => {
  return (
    // Tabla de rutas principal de la app.
    // Si la URL no coincide, se redirige al dashboard del residente.
    <Routes>
      <Route path={APP_ROUTES.home} element={<Navigate to={APP_ROUTES.residentDashboard} replace />} />
      <Route path={APP_ROUTES.residentDashboard} element={<ResidentDashboardPage />} />
      <Route path={APP_ROUTES.residentPayments} element={<ResidentPaymentsPage />} />
      <Route path={APP_ROUTES.residentProfile} element={<ResidentProfilePage />} />
      <Route path="*" element={<Navigate to={APP_ROUTES.residentDashboard} replace />} />
    </Routes>
  )
}

export default AppRouter
