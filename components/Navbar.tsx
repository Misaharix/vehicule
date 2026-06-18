'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';

/**
 * Top navigation bar with user menu and branding
 */
export function Navbar() {
  const { user, isAuthenticated, logout, isAdminAuthenticated, adminLogout } = useAuth();
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    try {
      if (isAdminAuthenticated) {
        await adminLogout();
      } else {
        await logout();
      }
      setShowUserMenu(false);
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const displayName = user
    ? `${user.firstName} ${user.lastName}`
    : isAdminAuthenticated
      ? 'Admin Panel'
      : 'UCP Santé';

  return (
    <nav className="bg-[#1a5c38] text-white shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo/Brand */}
          <Link href={isAdminAuthenticated ? '/admin/dashboard' : isAuthenticated ? '/dashboard' : '/login'} className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <div className="text-lg sm:text-2xl font-bold">🚗</div>
            <span className="text-base sm:text-lg md:text-xl font-bold hidden xs:inline">UCP</span>
            <span className="text-base sm:text-lg md:text-xl font-bold hidden sm:inline">Santé</span>
          </Link>

          {/* User Menu */}
          {(isAuthenticated || isAdminAuthenticated) && (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 rounded-md hover:bg-white hover:bg-opacity-10 transition"
              >
                <span className="text-xs sm:text-sm font-medium truncate max-w-[120px] sm:max-w-none">{displayName}</span>
                <svg
                  className={`w-4 h-4 flex-shrink-0 transition-transform ${showUserMenu ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-44 sm:w-48 bg-white text-gray-800 rounded-lg shadow-xl z-50">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-sm font-medium truncate">{displayName}</p>
                    <p className="text-xs text-gray-500 mt-1 truncate">
                      {user?.role || 'Admin'}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition"
                  >
                    Déconnexion
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
