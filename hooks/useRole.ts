import { useAuth } from '@/hooks/useAuth'
import { UserRole } from '@/types'

export function useRole() {
  const { user, admin, userRole } = useAuth()
  return {
    userRole,
    isAdmin: !!admin,
    isAuthenticated: !!user,
    hasRole: (role: UserRole) => user?.role === role,
    isDemandeur: user?.role === UserRole.DEMANDEUR,
    isChef: user?.role === UserRole.CHEF,
    isLogistique: user?.role === UserRole.LOGISTIQUE,
    isDirecteur: user?.role === UserRole.DIRECTEUR,
  }
}