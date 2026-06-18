'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useRole } from '@/hooks/useRole';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { StatCard } from '@/components/StatCard';
import { DemandeCard } from '@/components/DemandeCard';
import demandeService from '@/services/demandeService';
import { Demande } from '@/types';

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, isAdminAuthenticated, isLoading: authLoading } = useAuth();
  const { userRole } = useRole();
  const [demandes, setDemandes] = useState<Demande[]>([]);
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated && !isAdminAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, isAdminAuthenticated, router]);

  // Load demandes
  useEffect(() => {
    if (isAuthenticated) {
      loadDemandes();
    }
  }, [isAuthenticated]);

  const loadDemandes = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await demandeService.getAll({ page_size: 5 });
      
      // On extrait la liste de résultats en s'assurant que c'est un tableau
      // Si response.results n'existe pas, on prend un tableau vide [] par défaut
      const resultsList = Array.isArray(response?.results) ? response.results : [];
      
      setDemandes(resultsList);

      // Calcule les statistiques de manière sécurisée sur resultsList
      const pending = resultsList.filter((d) =>
        d?.status?.includes('en_attente')
      ).length;
      
      const approved = resultsList.filter((d) =>
        d?.status === 'approuvee'
      ).length;
      
      const rejected = resultsList.filter((d) =>
        d?.status?.includes('rejetee')
      ).length;

      setStats({ pending, approved, rejected });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || (isAuthenticated && isLoading)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">🔄</div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Tableau de bord Admin</h1>
            <div className="bg-white rounded-lg p-8 text-center">
              <p className="text-gray-600">Bienvenue sur le panneau d&apos;administration</p>
            </div>
          </main>
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
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Tableau de bord</h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Bienvenue, {userRole && userRole.charAt(0).toUpperCase() + userRole.slice(1)}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-6 md:mb-8">
            <StatCard label="En attente" value={stats.pending} color="yellow" icon="⏳" />
            <StatCard label="Approuvées" value={stats.approved} color="green" icon="✓" />
            <StatCard label="Rejetées" value={stats.rejected} color="red" icon="✗" />
          </div>

          {/* Recent Requests */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Demandes récentes</h2>

            {error && (
              <div className="p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg mb-6 text-sm">
                <p className="text-red-800 text-xs sm:text-sm">{error}</p>
              </div>
            )}

            {demandes.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <p className="text-gray-500 text-sm sm:text-base">Aucune demande trouvée</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {demandes.map((demande) => (
                  <DemandeCard key={demande.id} demande={demande} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
