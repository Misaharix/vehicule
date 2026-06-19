'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { Modal } from '@/components/Modal';
import chauffeurService from '@/services/chauffeurService';
// Assure-toi de créer ou d'importer ce service pour récupérer les financements
import financementService from '@/services/financementService'; 
import { Chauffeur } from '@/types';

// Interface locale pour typer les options de financement
interface Financement {
  id: number;
  nom: string;
}

export default function ChauffeurAdminPage() {
  const router = useRouter();
  const { isAdminAuthenticated, isLoading: authLoading } = useAuth();
  const [chauffeurs, setChauffeurs] = useState<Chauffeur[]>([]);
  const [financements, setFinancements] = useState<Financement[]>([]); // État pour stocker la liste déroulante
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    nomComplet: '',
    numeroLicence: '',
    numeroTelephone: '',
    disponible: true,
    financement_id: '', // Nouvelle clé ajoutée au formulaire
  });

  useEffect(() => {
    if (!authLoading && !isAdminAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAdminAuthenticated, router]);

  useEffect(() => {
    if (isAdminAuthenticated) {
      loadInitialData();
    }
  }, [isAdminAuthenticated]);

  // Chargement couplé des chauffeurs et de la liste des financements
  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [chauffeurResponse, financementResponse] = await Promise.all([
        chauffeurService.getAll({ page_size: 100 }),
        financementService.getAll() // Appel API pour charger les financements
      ]);

      setChauffeurs(chauffeurResponse.results);
      setFinancements(financementResponse || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des données';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (chauffeur?: Chauffeur) => {
    if (chauffeur) {
      setEditingId(chauffeur.id);
      setFormData({
        nomComplet: chauffeur.nomComplet,
        numeroLicence: chauffeur.numeroLicence,
        numeroTelephone: chauffeur.numeroTelephone,
        disponible: chauffeur.disponible,
        // On récupère l'ID si le financement imbriqué existe
        financement_id: chauffeur.financement ? String(chauffeur.financement.id) : '', 
      });
    } else {
      setEditingId(null);
      setFormData({
        nomComplet: '',
        numeroLicence: '',
        numeroTelephone: '',
        disponible: true,
        financement_id: '',
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      
      // On prépare le payload en transformant l'ID en entier (ou null si vide)
      const payload = {
        ...formData,
        financement_id: formData.financement_id ? parseInt(formData.financement_id, 10) : null
      };

      if (editingId) {
        await chauffeurService.update(editingId, payload);
      } else {
        await chauffeurService.create(payload);
      }
      setShowModal(false);
      loadInitialData(); // Recharger la table globale
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur';
      setError(errorMessage);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce chauffeur?')) {
      try {
        await chauffeurService.delete(id);
        loadInitialData();
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
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Gestion Chauffeurs</h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">Ajouter, modifier, supprimer des chauffeurs</p>
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
              {chauffeurs.length === 0 ? (
                <div className="p-6 sm:p-8 text-center text-gray-600 text-sm sm:text-base">
                  Aucun chauffeur trouvé
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs sm:text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Nom</th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase hidden sm:table-cell">Financement</th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase hidden md:table-cell">Téléphone</th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Dispo.</th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {chauffeurs.map((chauffeur) => (
                        <tr key={chauffeur.id} className="hover:bg-gray-50 transition">
                          <td className="px-3 sm:px-6 py-3 sm:py-4 font-medium text-gray-900 truncate">{chauffeur.nom}</td>
                          {/* Ajout de la colonne Financement dans le tableau */}
                          <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-600 hidden sm:table-cell truncate">
                            {chauffeur.financement ? chauffeur.financement.nom : 'Aucun'}
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-600 hidden md:table-cell truncate">{chauffeur.telephone}</td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4">
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                chauffeur.disponible
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {chauffeur.disponible ? 'Dispo' : 'Indisp'}
                            </span>
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 space-x-1 sm:space-x-2">
                            <button
                              onClick={() => handleOpenModal(chauffeur)}
                              className="text-[#1a5c38] hover:underline font-medium text-xs sm:text-sm"
                            >
                              Éditer
                            </button>
                            <button
                              onClick={() => handleDelete(chauffeur.id)}
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
        title={editingId ? 'Éditer chauffeur' : 'Ajouter chauffeur'}
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
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
            <input
              type="text"
              value={formData.nomComplet}
              onChange={(e) => setFormData({ ...formData, nomComplet: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5c38]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de permis</label>
            <input
              type="text"
              value={formData.numeroLicence}
              onChange={(e) => setFormData({ ...formData, numeroLicence: e.target.value })}
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

          {/* --- AJOUT DE LA LISTE DÉROULANTE DES FINANCEMENTS --- */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type de Financement</label>
            <select
              value={formData.financement_id}
              onChange={(e) => setFormData({ ...formData, financement_id: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1a5c38] text-sm"
            >
              <option value="">-- Sélectionner un financement --</option>
              {financements.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.nom}
                </option>
              ))}
            </select>
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