'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, Admin, UserRole } from '@/types'
import authService from '@/services/authService'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  admin: Admin | null
  isAdminAuthenticated: boolean
  adminLogin: (email: string, password: string) => Promise<void>
  adminLogout: () => Promise<void>
  userRole: UserRole | null
  hasRole: (role: UserRole) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const init = async () => {
      try {
        // Vérifier admin localStorage d'abord — pas d'appel API
        if (typeof window !== 'undefined') {
          const adminLogged = localStorage.getItem('admin_logged')
          const adminData = localStorage.getItem('admin_data')
          if (adminLogged === 'true' && adminData) {
            try {
              setAdmin(JSON.parse(adminData))
              return  // ← sortir directement, pas besoin de checker le token
            } catch {
              localStorage.removeItem('admin_logged')
              localStorage.removeItem('admin_data')
            }
          }

          // Vérifier token JWT utilisateur
          const token = localStorage.getItem('access_token')
          if (!token) return  // ← pas de token → pas connecté, sortir

          // Token présent → vérifier avec l'API
          const currentUser = await authService.getCurrentUser()
          if (currentUser) setUser(currentUser)
        }
      } catch (err) {
        console.error('Auth init error:', err)
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          localStorage.removeItem('user_data')
        }
      } finally {
        setIsLoading(false)  // ← toujours appelé
      }
    }

    init()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setError(null)
      const data = await authService.login(email, password)
      setUser(data)
      setAdmin(null)
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || 'Erreur de connexion'
      setError(msg)
      throw new Error(msg)
    }
  }

  const logout = async () => {
    try { await authService.logout() } catch {}
    finally {
      setUser(null)
      setAdmin(null)
    }
  }

  const adminLogin = async (email: string, password: string) => {
    try {
      setError(null)
      const data = await authService.adminLogin(email, password)
      setAdmin(data)
      setUser(null)
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || 'Erreur connexion admin'
      setError(msg)
      throw new Error(msg)
    }
  }

  const adminLogout = async () => {
    try { await authService.adminLogout() } catch {}
    finally {
      setUser(null)
      setAdmin(null)
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      error,
      login,
      logout,
      admin,
      isAdminAuthenticated: !!admin,
      adminLogin,
      adminLogout,
      userRole: user?.role as UserRole || null,
      hasRole: (role) => user?.role === role,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}