'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRole } from '@/hooks/useRole';
import { UserRole } from '@/types';
import { useState } from 'react';

/**
 * Left sidebar with role-based navigation
 */
export function Sidebar() {
  const pathname = usePathname();
  const { userRole, isAdmin } = useRole();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  if (!userRole && !isAdmin) return null;

  const isActive = (path: string) => pathname === path;

  // Admin navigation
  if (isAdmin) {
    const adminLinks = [
      { href: '/admin/dashboard', label: 'Tableau de bord' },
      { href: '/admin/demandeurs', label: 'Demandeurs' },
      { href: '/admin/vehicules', label: 'Véhicules' },
      { href: '/admin/chauffeurs', label: 'Chauffeurs' },
    ];

    return (
      <>
        {/* Mobile Toggle Button */}
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="lg:hidden fixed left-4 top-20 z-30 p-2 bg-[#1a5c38] text-white rounded-lg"
        >
          ☰
        </button>

        {/* Sidebar */}
        <aside className={`fixed lg:static left-0 top-14 sm:top-16 lg:top-0 h-[calc(100vh-56px)] sm:h-[calc(100vh-64px)] lg:h-screen w-52 sm:w-64 bg-gray-50 border-r border-gray-200 z-20 transform transition-transform lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <nav className="p-4 sm:p-6 space-y-2 overflow-y-auto h-full">
            {adminLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setIsMobileOpen(false)}
                className={`block px-3 sm:px-4 py-2 rounded-lg transition text-sm sm:text-base ${
                  isActive(href)
                    ? 'bg-[#1a5c38] text-white'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Mobile Overlay */}
        {isMobileOpen && (
          <div
            className="fixed lg:hidden inset-0 bg-black bg-opacity-50 z-10"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </>
    );
  }

  // User navigation - role-based
  const userLinks = [
    { href: '/dashboard', label: 'Tableau de bord', always: true },
    { href: '/demandes', label: 'Mes demandes', always: true },
    { href: '/demandes/new', label: 'Nouvelle demande', show: userRole === UserRole.DEMANDEUR },
    { href: '/validations', label: 'À valider', show: [UserRole.CHEF, UserRole.LOGISTIQUE, UserRole.DIRECTEUR].includes(userRole || UserRole.DEMANDEUR) },
  ];

  const visibleLinks = userLinks.filter((link) => link.always || link.show);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed left-4 top-20 z-30 p-2 bg-[#1a5c38] text-white rounded-lg"
      >
        ☰
      </button>

      {/* Sidebar */}
      <aside className={`fixed lg:static left-0 top-14 sm:top-16 lg:top-0 h-[calc(100vh-56px)] sm:h-[calc(100vh-64px)] lg:h-screen w-52 sm:w-64 bg-gray-50 border-r border-gray-200 z-20 transform transition-transform lg:translate-x-0 ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <nav className="p-4 sm:p-6 space-y-2 overflow-y-auto h-full">
          {visibleLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setIsMobileOpen(false)}
              className={`block px-3 sm:px-4 py-2 rounded-lg transition text-sm sm:text-base ${
                isActive(href)
                  ? 'bg-[#1a5c38] text-white'
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed lg:hidden inset-0 bg-black bg-opacity-50 z-10"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
}
