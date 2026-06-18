'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useRole } from '@/hooks/useRole';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { DemandeProgression } from '@/components/DemandeProgression';
import { Badge } from '@/components/Badge';
import Link from 'next/link';
import demandeService from '@/services/demandeService';
import { Demande } from '@/types';

export default function DemandePage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { canValidate } = useRole();
  const [demande, setDemande] = useState<Demande | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated && params.id) {
      loadDemande();
    }
  }, [isAuthenticated, params.id]);

  const loadDemande = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const id = typeof params.id === 'string' ? parseInt(params.id) : params.id;
      const data = await demandeService.getById(id);
      setDemande(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!demande || !confirm('Êtes-vous sûr de vouloir annuler cette demande?')) return;

    try {
      await demandeService.cancel(demande.id);
      loadDemande();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur';
      setError(errorMessage);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">🔄</div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!demande) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-8">
            <div className="bg-white rounded-lg p-8 text-center">
              <p className="text-gray-600 mb-4">Demande non trouvée</p>
              <Link href="/demandes" className="text-[#1a5c38] hover:underline">
                Retour aux demandes
              </Link>
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
        <main className="flex-1 p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <div className="flex items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-900">{demande.destination}</h1>
                <Badge status={demande.status} />
              </div>
              <p className="text-gray-600 mt-2">ID: {demande.id}</p>
            </div>
            <Link href="/demandes" className="text-gray-600 hover:text-gray-900">
              ← Retour
            </Link>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Progression */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Progression</h2>
                <DemandeProgression demande={demande} />
              </div>

              {/* Details */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Détails</h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Demandeur</p>
                    <p className="font-medium text-gray-900 mt-1">{demande.demandeur.nomComplet}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Motif</p>
                    <p className="font-medium text-gray-900 mt-1">{demande.motif}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Départ</p>
                    <p className="font-medium text-gray-900 mt-1">
                      {new Date(demande.dateDepart).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Retour</p>
                    <p className="font-medium text-gray-900 mt-1">
                      {new Date(demande.dateRetour).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Nombre de personnes</p>
                    <p className="font-medium text-gray-900 mt-1">{demande.nombrePersonnes}</p>
                  </div>
                  {demande.vehiculeRequete && (
                    <div>
                      <p className="text-gray-500">Véhicule requis</p>
                      <p className="font-medium text-gray-900 mt-1">{demande.vehiculeRequete}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Vehicle Assignment */}
              {demande.vehiculeAssigne && (
                <div className="bg-green-50 rounded-lg border border-green-200 p-6">
                  <h2 className="text-lg font-bold text-green-900 mb-4">Assignation</h2>
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="text-green-700">Véhicule</p>
                      <p className="font-medium text-green-900 mt-1">
                        {demande.vehiculeAssigne.marque} {demande.vehiculeAssigne.modele}
                      </p>
                      <p className="text-xs text-green-700">
                        {demande.vehiculeAssigne.immatriculation}
                      </p>
                    </div>
                    {demande.chauffeurAssigne && (
                      <div>
                        <p className="text-green-700">Chauffeur</p>
                        <p className="font-medium text-green-900 mt-1">
                          {demande.chauffeurAssigne.nomComplet}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Validations Summary */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-4">Validations</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Chef:</span>
                    {demande.validationChef ? (
                      <Badge status={demande.validationChef.statut} size="sm" />
                    ) : (
                      <span className="text-gray-400">En attente</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Logistique:</span>
                    {demande.validationLogistique ? (
                      <Badge status={demande.validationLogistique.statut} size="sm" />
                    ) : (
                      <span className="text-gray-400">En attente</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Directeur:</span>
                    {demande.validationDirecteur ? (
                      <Badge status={demande.validationDirecteur.statut} size="sm" />
                    ) : (
                      <span className="text-gray-400">En attente</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-4">Actions</h3>
                <div className="space-y-2">
                  {canValidate() && (
                    <Link
                      href={`/validations/${demande.id}`}
                      className="block w-full px-4 py-2 bg-[#1a5c38] text-white rounded-lg hover:bg-opacity-90 transition text-center text-sm font-medium"
                    >
                      Valider
                    </Link>
                  )}
                  <button
                    onClick={handleCancel}
                    className="w-full px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition text-sm font-medium"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
