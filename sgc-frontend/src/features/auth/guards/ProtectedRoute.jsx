import { Navigate, Outlet, useLocation } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { APP_ROUTES } from '@app/routes'
import { getHomeRouteByRole } from '../model/roleRedirect'

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const location = useLocation()
  const { hasRole, isAuthenticated, user } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to={APP_ROUTES.login} state={{ from: location }} replace />
  }

  if (!hasRole(allowedRoles)) {
    return <Navigate to={getHomeRouteByRole(user?.role)} replace />
  }

  return <Outlet />
}

export default ProtectedRoute
