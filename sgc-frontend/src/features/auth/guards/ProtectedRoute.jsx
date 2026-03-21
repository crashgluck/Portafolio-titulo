import { Navigate, Outlet, useLocation } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { APP_ROUTES } from '@app/routes'

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const location = useLocation()
  const { hasRole, isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to={APP_ROUTES.login} state={{ from: location }} replace />
  }

  if (!hasRole(allowedRoles)) {
    return <Navigate to={APP_ROUTES.unauthorized} replace />
  }

  return <Outlet />
}

export default ProtectedRoute
