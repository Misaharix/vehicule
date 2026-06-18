'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { DemandeCard } from '@/components/DemandeCard';
import Link from 'next/link';
import demandeService from '@/services/demandeService';
import { Demande } from '@/types';

export default function DemandesPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [demandes, setDemandes] = useState<Demande[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      loadDemandes();
    }
  }, [isAuthenticated, statusFilter, page]);

  const loadDemandes = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await demandeService.getAll({
        status: statusFilter || undefined,
        page,
        page_size: 12,
      });
      
      // Ajustement selon le format reçu (paginé avec .results ou brut en tableau)
      if (response && response.results) {
        setDemandes(Array.isArray(response.results) ? response.results : []);
      } else {
        setDemandes(Array.isArray(response) ? response : []);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement';
      setError(errorMessage);
      setDemandes([]);
    } finally {
      setIsLoading(false);
    }
  };

  // RE-AJOUTÉ : La fonction handleCancel manquante
  const handleCancel = async (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir annuler cette demande?')) {
      try {
        await demandeService.cancel(id);
        loadDemandes();
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erreur';
        setError(errorMessage);
      }
    }
  };

  const statuses = [
    { value: '', label: 'Tous les statuts' },
    { value: 'en_attente_chef', label: 'En attente Chef' },
    { value: 'en_attente_logistique', label: 'En attente Logistique' },
    { value: 'en_attente_directeur', label: 'En attente Directeur' },
    { value: 'approuvee', label: 'Approuvée' },
    { value: 'rejetee_chef', label: 'Rejetée (Chef)' },
    { value: 'rejetee_logistique', label: 'Rejetée (Logistique)' },
    { value: 'rejetee_directeur', label: 'Rejetée (Directeur)' },
    { value: 'annulee', label: 'Annulée' },
  ];

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
          <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Demandes de véhicules</h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">Consultez et gérez vos demandes</p>
            </div>
            <Link
              href="/demandes/new"
              className="px-3 sm:px-4 py-2 bg-[#1a5c38] text-white rounded-lg hover:bg-opacity-90 transition font-medium text-xs sm:text-sm whitespace-nowrap"
            >
              + Nouvelle demande
            </Link>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 mb-6">
            <label htmlFor="status" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              Filtrer par statut
            </label>
            <select
              id="status"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full sm:max-w-64 px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5c38]"
            >
              {statuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
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

          {/* Demandes Grid */}
          {!isLoading && demandes.length === 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6 sm:p-12 text-center">
              <p className="text-gray-600 mb-4 text-sm sm:text-base">Aucune demande trouvée</p>
              <Link
                href="/demandes/new"
                className="text-[#1a5c38] hover:underline font-medium text-sm sm:text-base"
              >
                Créer une nouvelle demande
              </Link>
            </div>
          )}

          {!isLoading && demandes.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {demandes.map((demande) => (
                <DemandeCard
                  key={demande.id}
                  demande={demande}
                  onCancel={handleCancel}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}