'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { Modal } from '@/components/Modal';
import vehiculeService from '@/services/vehiculeService';
import { Vehicule } from '@/types';

export default function VehiculeAdminPage() {
  const router = useRouter();
  const { isAdminAuthenticated, isLoading: authLoading } = useAuth();
  const [vehicules, setVehicules] = useState<Vehicule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    marque: '',
    modele: '',
    immatriculation: '',
    nombrePlaces: 1,
    carburant: '',
    disponible: true,
  });

  useEffect(() => {
    if (!authLoading && !isAdminAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAdminAuthenticated, router]);

  useEffect(() => {
    if (isAdminAuthenticated) {
      loadVehicules();
    }
  }, [isAdminAuthenticated]);

  const loadVehicules = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await vehiculeService.getAll({ page_size: 100 });
      setVehicules(response.results);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (vehicule?: Vehicule) => {
    if (vehicule) {
      setEditingId(vehicule.id);
      setFormData({
        marque: vehicule.marque,
        modele: vehicule.modele,
        immatriculation: vehicule.immatriculation,
        nombrePlaces: vehicule.nombrePlaces,
        carburant: vehicule.carburant,
        disponible: vehicule.disponible,
      });
    } else {
      setEditingId(null);
      setFormData({
        marque: '',
        modele: '',
        immatriculation: '',
        nombrePlaces: 1,
        carburant: '',
        disponible: true,
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      if (editingId) {
        await vehiculeService.update(editingId, formData);
      } else {
        await vehiculeService.create(formData);
      }
      setShowModal(false);
      loadVehicules();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur';
      setError(errorMessage);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce véhicule?')) {
      try {
        await vehiculeService.delete(id);
        loadVehicules();
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erreur';
        setError(errorMessage);
      }
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
          <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Gestion Véhicules</h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">Gérer la flotte de véhicules</p>
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="px-3 sm:px-4 py-2 bg-[#1a5c38] text-white rounded-lg hover:bg-opacity-90 transition font-medium text-xs sm:text-sm whitespace-nowrap"
            >
              + Ajouter
            </button>
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
              <p className="text-gray-600 text-sm sm:text-base">Chargement...</p>
            </div>
          )}

          {/* Table */}
          {!isLoading && (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {vehicules.length === 0 ? (
                <div className="p-6 sm:p-8 text-center text-gray-600 text-sm sm:text-base">
                  Aucun véhicule trouvé
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs sm:text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Marque</th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase hidden sm:table-cell">Modèle</th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase hidden md:table-cell">Immatriculation</th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase hidden lg:table-cell">Places</th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase hidden lg:table-cell">Carburant</th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Dispo.</th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {vehicules.map((vehicule) => (
                        <tr key={vehicule.id} className="hover:bg-gray-50 transition">
                          <td className="px-3 sm:px-6 py-3 sm:py-4 font-medium text-gray-900 truncate">{vehicule.marque}</td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-600 hidden sm:table-cell truncate">{vehicule.modele}</td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-600 hidden md:table-cell truncate">{vehicule.immatriculation}</td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-600 hidden lg:table-cell">{vehicule.nombrePlaces}</td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-600 hidden lg:table-cell">{vehicule.carburant}</td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4">
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                vehicule.disponible
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {vehicule.disponible ? 'Dispo' : 'Indisp'}
                            </span>
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 space-x-1 sm:space-x-2">
                            <button
                              onClick={() => handleOpenModal(vehicule)}
                              className="text-[#1a5c38] hover:underline font-medium text-xs sm:text-sm"
                            >
                              Éditer
                            </button>
                            <button
                              onClick={() => handleDelete(vehicule.id)}
                              className="text-red-600 hover:underline font-medium text-xs sm:text-sm"
                            >
                              Suppr.
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingId ? 'Éditer véhicule' : 'Ajouter véhicule'}
        size="md"
        actions={
          <>
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              Annuler
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-[#1a5c38] text-white rounded-lg hover:bg-opacity-90 transition font-medium"
            >
              Enregistrer
            </button>
          </>
        }
      >
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Marque</label>
              <input
                type="text"
                value={formData.marque}
                onChange={(e) => setFormData({ ...formData, marque: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5c38]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Modèle</label>
              <input
                type="text"
                value={formData.modele}
                onChange={(e) => setFormData({ ...formData, modele: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5c38]"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Immatriculation</label>
            <input
              type="text"
              value={formData.immatriculation}
              onChange={(e) => setFormData({ ...formData, immatriculation: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5c38]"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de places</label>
              <input
                type="number"
                value={formData.nombrePlaces}
                onChange={(e) => setFormData({ ...formData, nombrePlaces: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5c38]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Carburant</label>
              <select
                value={formData.carburant}
                onChange={(e) => setFormData({ ...formData, carburant: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5c38]"
              >
                <option value="">Sélectionner</option>
                <option value="Essence">Essence</option>
                <option value="Diesel">Diesel</option>
                <option value="Électrique">Électrique</option>
                <option value="Hybride">Hybride</option>
              </select>
            </div>
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                checked={formData.disponible}
                onChange={(e) => setFormData({ ...formData, disponible: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300"
              />
              Disponible
            </label>
          </div>
        </form>
      </Modal>
    </div>
  );
}
