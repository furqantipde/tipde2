import { Navigate, useLocation } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="relative w-12 h-12 mb-4">
          <div className="absolute inset-0 rounded-full border-3 border-gray-200 dark:border-gray-700" />
          <div className="absolute inset-0 rounded-full border-3 border-red-600 border-t-transparent animate-spin" />
        </div>
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 tracking-wide uppercase">
          Authenticating...
        </p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />
  }

  return <>{children}</>
}
