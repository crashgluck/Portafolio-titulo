import { Navigate, Outlet } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { getHomeRouteByRole } from '../model/roleRedirect'

const PublicOnlyRoute = () => {
  const { isAuthenticated, user } = useAuth()

  if (isAuthenticated) {
    return <Navigate to={getHomeRouteByRole(user?.role)} replace />
  }

  return <Outlet />
}

export default PublicOnlyRoute
