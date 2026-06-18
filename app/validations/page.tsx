'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useRole } from '@/hooks/useRole';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { DemandeCard } from '@/components/DemandeCard';
import demandeService from '@/services/demandeService';
import { Demande } from '@/types';

export default function ValidationsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { canValidate } = useRole();
  const [demandes, setDemandes] = useState<Demande[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated && canValidate()) {
      loadPendingDemandes();
    }
  }, [isAuthenticated, canValidate()]);

  const loadPendingDemandes = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await demandeService.getPending({ page_size: 20 });
      setDemandes(response.results);
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

  if (!canValidate()) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 w-full">
            <div className="bg-white rounded-lg p-6 sm:p-8 text-center">
              <p className="text-gray-600 text-sm sm:text-base">Vous n&apos;avez pas accès à cette page</p>
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
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Demandes à valider</h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Consultez les demandes en attente de votre validation</p>
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
              <p className="text-gray-600 text-sm sm:text-base">Chargement des demandes...</p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && demandes.length === 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6 sm:p-12 text-center">
              <p className="text-gray-600 text-sm sm:text-base">Aucune demande à valider</p>
            </div>
          )}

          {/* Demandes Grid */}
          {!isLoading && demandes.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {demandes.map((demande) => (
                <DemandeCard key={demande.id} demande={demande} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
