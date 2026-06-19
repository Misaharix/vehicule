'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { Modal } from '@/components/Modal';
import adminService from '@/services/adminService';

interface Vehicule {
  id: number;
  immatriculation: string;
  marque: string;
  modele: string;
  disponible: boolean;
}

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
      const data = await adminService.getVehicules();
      setVehicules(data);
    } catch (err) {
      setError('Erreur lors du chargement des véhicules');
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
        disponible: vehicule.disponible,
      });
    } else {
      setEditingId(null);
      setFormData({ marque: '', modele: '', immatriculation: '', disponible: true });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      if (editingId) {
        await adminService.modifierVehicule(editingId, formData);
      } else {
        await adminService.creerVehicule(formData);
      }
      setShowModal(false);
      loadVehicules();
    } catch (err) {
      setError('Erreur lors de l\'enregistrement');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Supprimer ce véhicule ?')) {
      try {
        await adminService.desactiverVehicule(id);
        loadVehicules();
      } catch (err) {
        setError('Erreur lors de la suppression');
      }
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin text-4xl">🔄</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 w-full">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Gestion Véhicules</h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">Gérer la flotte de véhicules</p>
            </div>
            <button onClick={() => handleOpenModal()}
              className="px-4 py-2 bg-[#1a5c38] text-white rounded-lg hover:bg-opacity-90 transition text-sm font-medium">
              + Ajouter
            </button>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin text-4xl mb-4">🔄</div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {vehicules.length === 0 ? (
                <p className="p-8 text-center text-gray-500">Aucun véhicule</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Marque</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Modèle</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Immatriculation</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Disponible</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {vehicules.map((v) => (
                        <tr key={v.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium text-gray-900">{v.marque}</td>
                          <td className="px-6 py-4 text-gray-600">{v.modele}</td>
                          <td className="px-6 py-4 text-gray-600">{v.immatriculation}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              v.disponible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {v.disponible ? 'Dispo' : 'Indispo'}
                            </span>
                          </td>
                          <td className="px-6 py-4 space-x-2">
                            <button onClick={() => handleOpenModal(v)}
                              className="text-[#1a5c38] hover:underline font-medium text-sm">
                              Éditer
                            </button>
                            <button onClick={() => handleDelete(v.id)}
                              className="text-red-600 hover:underline font-medium text-sm">
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

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}
        title={editingId ? 'Éditer véhicule' : 'Ajouter véhicule'} size="md"
        actions={
          <>
            <button onClick={() => setShowModal(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
              Annuler
            </button>
            <button onClick={handleSubmit}
              className="px-4 py-2 bg-[#1a5c38] text-white rounded-lg hover:bg-opacity-90 transition">
              Enregistrer
            </button>
          </>
        }>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Marque</label>
            <input type="text" value={formData.marque}
              onChange={(e) => setFormData({ ...formData, marque: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5c38]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Modèle</label>
            <input type="text" value={formData.modele}
              onChange={(e) => setFormData({ ...formData, modele: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5c38]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Immatriculation</label>
            <input type="text" value={formData.immatriculation}
              onChange={(e) => setFormData({ ...formData, immatriculation: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5c38]" />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <input type="checkbox" checked={formData.disponible}
                onChange={(e) => setFormData({ ...formData, disponible: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300" />
              Disponible
            </label>
          </div>
        </form>
      </Modal>
    </div>
  );
}