'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { DemandeForm } from '@/components/DemandeForm';
import demandeService from '@/services/demandeService';
import { Demande } from '@/types';

export default function NewDemandePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  const handleSubmit = async (data: Partial<Demande>) => {
    try {
      setIsLoading(true);
      setError(null);
      await demandeService.create(data);
      setSuccess(true);

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/demandes');
      }, 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la création';
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
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Nouvelle demande</h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Créez une nouvelle demande de véhicule</p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-sm sm:text-base font-medium">Demande créée avec succès!</p>
              <p className="text-green-700 text-xs sm:text-sm mt-1">Redirection en cours...</p>
            </div>
          )}

          {/* Form Card */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6 lg:p-8 max-w-2xl">
            <DemandeForm
              onSubmit={handleSubmit}
              isLoading={isLoading}
              error={error}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
