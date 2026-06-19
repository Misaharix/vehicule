'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { Modal } from '@/components/Modal';
import demandeurService from '@/services/demandeurService';
import { Demandeur } from '@/types';

export default function DemandeurAdminPage() {
  const router = useRouter();
  const { isAdminAuthenticated, isLoading: authLoading } = useAuth();
  const [demandeurs, setDemandeurs] = useState<Demandeur[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    numeroTelephone: '',
    departement: '',
    poste: '',
  });

  useEffect(() => {
    if (!authLoading && !isAdminAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAdminAuthenticated, router]);

  useEffect(() => {
    if (isAdminAuthenticated) {
      loadDemandeurs();
    }
  }, [isAdminAuthenticated]);

  const loadDemandeurs = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await demandeurService.getAll({ page_size: 100 });
      
      // FIX SÉCURISÉ : Gestion flexible du format de l'API (paginé ou brut)
      if (response && response.results) {
        setDemandeurs(Array.isArray(response.results) ? response.results : []);
      } else {
        setDemandeurs(Array.isArray(response) ? response : []);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement';
      setError(errorMessage);
      setDemandeurs([]); // Sécurité : évite le crash en cas d'erreur de requête
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (demandeur?: Demandeur) => {
    if (demandeur) {
      setEditingId(demandeur.id);
      setFormData({
        nom: demandeur.nomComplet,
        email: demandeur.email,
        numeroTelephone: demandeur.numeroTelephone,
        departement: demandeur.departement,
        poste: demandeur.poste,
      });
    } else {
      setEditingId(null);
      setFormData({
        nom: '',
        email: '',
        numeroTelephone: '',
        departement: '',
        poste: '',
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      if (editingId) {
        await demandeurService.update(editingId, formData);
      } else {
        await demandeurService.create(formData);
      }
      setShowModal(false);
      loadDemandeurs();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur';
      setError(errorMessage);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce demandeur?')) {
      try {
        await demandeurService.delete(id);
        loadDemandeurs();
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
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Gestion Demandeurs</h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">Ajouter, modifier, supprimer des demandeurs</p>
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
              {(demandeurs || []).length === 0 ? (
                <div className="p-6 sm:p-8 text-center text-gray-600 text-sm sm:text-base">
                  Aucun demandeur trouvé
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs sm:text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Nom</th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase hidden sm:table-cell">Email</th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase hidden md:table-cell">Téléphone</th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase hidden lg:table-cell">Département</th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase hidden lg:table-cell">Poste</th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {demandeurs.map((demandeur) => (
                        <tr key={demandeur.id} className="hover:bg-gray-50 transition">
                          <td className="px-3 sm:px-6 py-3 sm:py-4 font-medium text-gray-900 truncate">{demandeur.nom}</td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-600 hidden sm:table-cell truncate">{demandeur.email}</td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-600 hidden md:table-cell truncate">{demandeur.telephone}</td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-600 hidden lg:table-cell truncate">{demandeur.departement}</td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-600 hidden lg:table-cell truncate">{demandeur.poste}</td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 space-x-1 sm:space-x-2">
                            <button
                              onClick={() => handleOpenModal(demandeur)}
                              className="text-[#1a5c38] hover:underline font-medium text-xs sm:text-sm"
                            >
                              Éditer
                            </button>
                            <button
                              onClick={() => handleDelete(demandeur.id)}
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
        title={editingId ? 'Éditer demandeur' : 'Ajouter demandeur'}
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input
              type="text"
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5c38]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5c38]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
            <input
              type="tel"
              value={formData.numeroTelephone}
              onChange={(e) => setFormData({ ...formData, numeroTelephone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5c38]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Département</label>
            <input
              type="text"
              value={formData.departement}
              onChange={(e) => setFormData({ ...formData, departement: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5c38]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Poste</label>
            <input
              type="text"
              value={formData.poste}
              onChange={(e) => setFormData({ ...formData, poste: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5c38]"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}