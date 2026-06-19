'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Admin, UserRole } from '@/types';
import authService from '@/services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  admin: Admin | null;
  isAdminAuthenticated: boolean;
  adminLogin: (email: string, password: string) => Promise<void>;
  adminLogout: () => Promise<void>;
  userRole: UserRole | null;
  hasRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);

        // 1. Vérifier admin d'abord (localStorage, pas d'appel API)
        const adminLogged = localStorage.getItem('admin_logged')
        const adminData = localStorage.getItem('admin_data')

        if (adminLogged && adminData) {
          // Admin connecté → restaurer depuis localStorage sans appel API
          setAdmin(JSON.parse(adminData))
          setUser(null)
          return
        }

        // 2. Vérifier token JWT utilisateur
        const token = localStorage.getItem('access_token')
        if (!token) {
          // Pas de token → pas connecté
          setUser(null)
          setAdmin(null)
          return
        }

        // 3. Token présent → vérifier s'il est valide
        const currentUser = await authService.getCurrentUser()
        if (currentUser) {
          setUser(currentUser)
          setAdmin(null)
        } else {
          // Token invalide → nettoyer
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          localStorage.removeItem('user_data')
          setUser(null)
          setAdmin(null)
        }
      } catch (err) {
        console.error('Auth init error:', err)
        // En cas d'erreur → nettoyer tout
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user_data')
        setUser(null)
        setAdmin(null)
      } finally {
        setIsLoading(false)
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);
      const userData = await authService.login(email, password);
      setUser(userData);
      setAdmin(null);
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || 'Erreur de connexion'
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await authService.logout();
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      setUser(null);
      setAdmin(null);
    }
  };

  const adminLogin = async (email: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);
      const adminData = await authService.adminLogin(email, password);
      setAdmin(adminData);
      setUser(null);
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || 'Erreur connexion admin'
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const adminLogout = async () => {
    try {
      setError(null);
      await authService.adminLogout();
    } catch (err) {
      console.error('Admin logout error:', err)
    } finally {
      setUser(null);
      setAdmin(null);
    }
  };

  const isAuthenticated = !!user;
  const isAdminAuthenticated = !!admin;
  const userRole = user?.role || null;
  const hasRole = (role: UserRole) => userRole === role;

  return (
    <AuthContext.Provider value={{
      user, isAuthenticated, isLoading, error,
      login, logout,
      admin, isAdminAuthenticated,
      adminLogin, adminLogout,
      userRole, hasRole,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}