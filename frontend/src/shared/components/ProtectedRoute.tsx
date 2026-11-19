
import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/features/auth'
import Skeleton from './Skeleton'

interface ProtectedRouteProps {
  allowedRoles?: string[]
}

function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const user = useAuthStore((state) => state.user)
  const status = useAuthStore((state) => state.status)

  if (status === 'checking') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-stone-50 px-6 dark:bg-slate-950">
        <Skeleton className="h-10 w-48" />
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Verificando sesión…</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (
    allowedRoles &&
    !allowedRoles.includes(user.role)
  ) {
    return <Navigate to="/unauthorized" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
