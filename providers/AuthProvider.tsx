'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Admin, UserRole } from '@/types';
import authService from '@/services/authService';

interface AuthContextType {
  // User auth
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;

  // Admin auth
  admin: Admin | null;
  isAdminAuthenticated: boolean;
  adminLogin: (email: string, password: string) => Promise<void>;
  adminLogout: () => Promise<void>;

  // Helpers
  userRole: UserRole | null;
  hasRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        
        // Try to get current user
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          setAdmin(null);
        } else {
          // Try to get current admin
          const currentAdmin = await authService.getCurrentAdmin();
          if (currentAdmin) {
            setAdmin(currentAdmin);
            setUser(null);
          }
        }
      } catch (err) {
        console.error('[v0] Auth initialization error:', err);
      } finally {
        setIsLoading(false);
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
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await authService.logout();
      setUser(null);
      setAdmin(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Logout failed';
      setError(errorMessage);
    }
  };

  const adminLogin = async (email: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);
      const adminData = await authService.adminLogin(email, password);
      setAdmin(adminData);
      setUser(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Admin login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const adminLogout = async () => {
    try {
      setError(null);
      await authService.adminLogout();
      setUser(null);
      setAdmin(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Admin logout failed';
      setError(errorMessage);
    }
  };

  const isAuthenticated = !!user;
  const isAdminAuthenticated = !!admin;
  const userRole = user?.role || null;

  const hasRole = (role: UserRole): boolean => {
    return userRole === role;
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    admin,
    isAdminAuthenticated,
    adminLogin,
    adminLogout,
    userRole,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to use authentication context
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
