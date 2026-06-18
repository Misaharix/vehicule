'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { StatCard } from '@/components/StatCard';
import demandeService from '@/services/demandeService';
import vehiculeService from '@/services/vehiculeService';
import chauffeurService from '@/services/chauffeurService';
import demandeurService from '@/services/demandeurService';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { isAdminAuthenticated, isLoading: authLoading } = useAuth();
  const [stats, setStats] = useState({
    totalDemandes: 0,
    totalVehicules: 0,
    totalChauffeurs: 0,
    totalDemandeurs: 0,
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

      const [demandes, vehicules, chauffeurs, demandeurs] = await Promise.all([
        demandeService.getAll({ page_size: 1 }),
        vehiculeService.getAll({ page_size: 1 }),
        chauffeurService.getAll({ page_size: 1 }),
        demandeurService.getAll({ page_size: 1 }),
      ]);

      setStats({
        totalDemandes: demandes.count,
        totalVehicules: vehicules.count,
        totalChauffeurs: chauffeurs.count,
        totalDemandeurs: demandeurs.count,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement';
      setError(errorMessage);
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
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Tableau de bord Admin</h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Vue d&apos;ensemble du système</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg mb-6 text-sm">
              <p className="text-red-800 text-xs sm:text-sm">{error}</p>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-8 sm:py-12">
              <div className="animate-spin text-3xl sm:text-4xl mb-4">🔄</div>
              <p className="text-gray-600 text-sm sm:text-base">Chargement des statistiques...</p>
            </div>
          )}

          {/* Stats Grid */}
          {!isLoading && (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              <StatCard label="Demandes" value={stats.totalDemandes} color="blue" icon="📋" />
              <StatCard label="Véhicules" value={stats.totalVehicules} color="green" icon="🚗" />
              <StatCard label="Chauffeurs" value={stats.totalChauffeurs} color="purple" icon="👤" />
              <StatCard label="Demandeurs" value={stats.totalDemandeurs} color="yellow" icon="👥" />
            </div>
          )}

          {/* Quick Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mt-6 md:mt-8">
            <a
              href="/admin/demandeurs"
              className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 hover:shadow-lg transition text-center"
            >
              <div className="text-2xl sm:text-3xl mb-2">👥</div>
              <h3 className="font-bold text-sm sm:text-base text-gray-900">Gestion Demandeurs</h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">Ajouter, modifier, supprimer</p>
            </a>
            <a
              href="/admin/vehicules"
              className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 hover:shadow-lg transition text-center"
            >
              <div className="text-2xl sm:text-3xl mb-2">🚗</div>
              <h3 className="font-bold text-sm sm:text-base text-gray-900">Gestion Véhicules</h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">Gérer la flotte</p>
            </a>
            <a
              href="/admin/chauffeurs"
              className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 hover:shadow-lg transition text-center"
            >
              <div className="text-2xl sm:text-3xl mb-2">👤</div>
              <h3 className="font-bold text-sm sm:text-base text-gray-900">Gestion Chauffeurs</h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">Gérer les chauffeurs</p>
            </a>
            <a
              href="/demandes"
              className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 hover:shadow-lg transition text-center"
            >
              <div className="text-2xl sm:text-3xl mb-2">📋</div>
              <h3 className="font-bold text-sm sm:text-base text-gray-900">Consulter Demandes</h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">Voir toutes les demandes</p>
            </a>
          </div>
        </main>
      </div>
    </div>
  );
}
