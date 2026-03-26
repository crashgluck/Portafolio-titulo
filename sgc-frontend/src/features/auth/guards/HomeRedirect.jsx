import { Navigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { APP_ROUTES } from '@app/routes'
import { getHomeRouteByRole } from '../model/roleRedirect'

const HomeRedirect = () => {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to={APP_ROUTES.login} replace />
  }

  return <Navigate to={getHomeRouteByRole(user?.role)} replace />
}

export default HomeRedirect
