'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import adminService from '@/services/adminService';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { isAdminAuthenticated, isLoading: authLoading } = useAuth();
  const [stats, setStats] = useState({
    total_demandeurs: 0,
    total_vehicules: 0,
    total_chauffeurs: 0,
    total_demandes: 0,
    demandes_en_attente: 0,
    demandes_approuvees: 0,
    demandes_rejetees: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAdminAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAdminAuthenticated, router]);

  useEffect(() => {
    if (isAdminAuthenticated) {
      loadStats();
    }
  }, [isAdminAuthenticated]);

  const loadStats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await adminService.getStats();
      setStats(data);
    } catch (err) {
      setError('Erreur lors du chargement des statistiques');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">🔄</div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 w-full">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Tableau de bord Admin</h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Vue d&apos;ensemble du système</p>
          </div>

          {error && (
            <div className="p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
              <p className="text-red-800 text-xs sm:text-sm">{error}</p>
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-8 sm:py-12">
              <div className="animate-spin text-3xl sm:text-4xl mb-4">🔄</div>
              <p className="text-gray-600 text-sm sm:text-base">Chargement des statistiques...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              <StatCard label="Demandeurs" value={stats.total_demandeurs} color="blue" icon="👥" />
              <StatCard label="Véhicules" value={stats.total_vehicules} color="green" icon="🚗" />
              <StatCard label="Chauffeurs" value={stats.total_chauffeurs} color="purple" icon="👤" />
              <StatCard label="Demandes" value={stats.total_demandes} color="orange" icon="📋" />
              <StatCard label="En attente" value={stats.demandes_en_attente} color="yellow" icon="⏳" />
              <StatCard label="Approuvées" value={stats.demandes_approuvees} color="green" icon="✅" />
              <StatCard label="Rejetées" value={stats.demandes_rejetees} color="red" icon="❌" />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mt-6 md:mt-8">
            {[
              { href: '/admin/demandeurs', icon: '👥', label: 'Gestion Demandeurs', desc: 'Ajouter, modifier, supprimer' },
              { href: '/admin/vehicules', icon: '🚗', label: 'Gestion Véhicules', desc: 'Gérer la flotte' },
              { href: '/admin/chauffeurs', icon: '👤', label: 'Gestion Chauffeurs', desc: 'Gérer les chauffeurs' },
            ].map(({ href, icon, label, desc }) => (
              <a key={href} href={href}
                className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 hover:shadow-lg transition text-center">
                <div className="text-2xl sm:text-3xl mb-2">{icon}</div>
                <h3 className="font-bold text-sm sm:text-base text-gray-900">{label}</h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">{desc}</p>
              </a>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }: {
  label: string
  value: number
  icon: string
  color: string
}) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      <div className="text-2xl sm:text-3xl mb-2">{icon}</div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}