import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

/**
 * Csak bejelentkezett user férhet hozzá a child route-okhoz.
 * Visszaemlékezünk az eredeti útra, hogy login után visszairányítsunk.
 */
export function ProtectedRoute() {
  const isAuth = useAuthStore((s) => s.isAuthenticated())
  const location = useLocation()

  if (!isAuth) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  return <Outlet />
}
