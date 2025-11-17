import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { UserRole } from '@/types'
import { Skeleton } from '@/components/ui/skeleton'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: UserRole | UserRole[]
  fallbackPath?: string
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  fallbackPath = '/login'
}) => {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="space-y-4 w-full max-w-md">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />
  }

  if (requiredRole) {
    const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
    if (!allowedRoles.includes(user.role)) {
      // Redirect to appropriate dashboard based on user role
      const rolePaths: Record<UserRole, string> = {
        admin: '/admin',
        teacher: '/teacher',
        tu: '/admin'
      }
      return <Navigate to={rolePaths[user.role]} replace />
    }
  }

  return <>{children}</>
}

export const PublicOnlyRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="space-y-4 w-full max-w-md">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    )
  }

  if (user) {
    const rolePaths: Record<UserRole, string> = {
      admin: '/admin',
      teacher: '/teacher',
      tu: '/admin'
    }
    return <Navigate to={rolePaths[user.role]} state={{ from: location }} replace />
  }

  return <>{children}</>
}