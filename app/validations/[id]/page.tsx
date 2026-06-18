'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useRole } from '@/hooks/useRole';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { DemandeProgression } from '@/components/DemandeProgression';
import { ValidationForm } from '@/components/ValidationForm';
import Link from 'next/link';
import demandeService from '@/services/demandeService';
import validationService from '@/services/validationService';
import { Demande, ValidationStatut } from '@/types';

export default function ValidationPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { canValidate } = useRole();
  const [demande, setDemande] = useState<Demande | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated && canValidate() && params.id) {
      loadDemande();
    }
  }, [isAuthenticated, canValidate(), params.id]);

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

  const handleSubmit = async (data: {
    statut: ValidationStatut;
    comments?: string;
    vehicule?: number;
    chauffeur?: number;
  }) => {
    if (!demande) return;

    try {
      setIsSubmitting(true);
      setError(null);
      await validationService.submitValidation(demande.id, data);
      setSuccess(true);

      // Reload demande to show updated status
      setTimeout(() => {
        loadDemande();
        setSuccess(false);
      }, 1500);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la validation';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
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
              <Link href="/validations" className="text-[#1a5c38] hover:underline">
                Retour aux validations
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
              <h1 className="text-3xl font-bold text-gray-900">Valider demande</h1>
              <p className="text-gray-600 mt-1">{demande.destination}</p>
            </div>
            <Link href="/validations" className="text-gray-600 hover:text-gray-900">
              ← Retour
            </Link>
          </div>

          {/* Success Message */}
          {success && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-6">
              <p className="text-green-800 font-medium">Validation enregistrée!</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Progression */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Progression</h2>
                <DemandeProgression demande={demande} />
              </div>

              {/* Validation Form */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Décision de validation</h2>
                <ValidationForm
                  demande={demande}
                  onSubmit={handleSubmit}
                  isLoading={isSubmitting}
                  error={error}
                />
              </div>
            </div>

            {/* Sidebar - Request Details */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4">Détails de la demande</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-gray-500">Demandeur</p>
                  <p className="font-medium text-gray-900 mt-1">{demande.demandeur.nomComplet}</p>
                  <p className="text-xs text-gray-500 mt-1">{demande.demandeur.email}</p>
                </div>

                <div>
                  <p className="text-gray-500">Destination</p>
                  <p className="font-medium text-gray-900 mt-1">{demande.destination}</p>
                </div>

                <div>
                  <p className="text-gray-500">Motif</p>
                  <p className="font-medium text-gray-900 mt-1">{demande.motif}</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-gray-500 text-xs">Départ</p>
                    <p className="font-medium text-gray-900">
                      {new Date(demande.dateDepart).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Retour</p>
                    <p className="font-medium text-gray-900">
                      {new Date(demande.dateRetour).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
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
          </div>
        </main>
      </div>
    </div>
  );
}
