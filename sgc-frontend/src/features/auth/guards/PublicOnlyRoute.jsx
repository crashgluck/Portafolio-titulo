import { Navigate, Outlet } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { APP_ROUTES } from '@app/routes'

const PublicOnlyRoute = () => {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to={APP_ROUTES.residentDashboard} replace />
  }

  return <Outlet />
}

export default PublicOnlyRoute
