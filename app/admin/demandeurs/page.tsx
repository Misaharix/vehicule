'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { Modal } from '@/components/Modal';
import demandeurService from '@/services/demandeurService';
import { Demandeur } from '@/types';

const ROLES = [
  { value: 'Demandeur', label: 'Demandeur' },
  { value: 'Chef', label: 'Chef Direct' },
  { value: 'Logistique', label: 'Responsable Logistique' },
  { value: 'Directeur', label: 'Directeur' },
];

const EMPTY_FORM = {
  first_name: '',
  last_name: '',
  email: '',
  username: '',
  password: '',
  telephone: '',
  service: '',
  poste: '',
  role: 'Demandeur',
};

export default function DemandeurAdminPage() {
  const router = useRouter();
  const { isAdminAuthenticated, isLoading: authLoading } = useAuth();
  const [demandeurs, setDemandeurs] = useState<Demandeur[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

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
      if (response && response.results) {
        setDemandeurs(Array.isArray(response.results) ? response.results : []);
      } else {
        setDemandeurs(Array.isArray(response) ? response as any : []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
      setDemandeurs([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (demandeur?: Demandeur) => {
    if (demandeur) {
      setEditingId(demandeur.id);
      setFormData({
        first_name: demandeur.first_name || '',
        last_name:  demandeur.last_name  || '',
        email:      demandeur.email      || '',
        username:   demandeur.username   || '',
        password:   '',  // ne pas pré-remplir le mot de passe
        telephone:  demandeur.telephone  || '',
        service:    demandeur.service    || '',
        poste:      demandeur.poste      || '',
        role:       demandeur.role       || 'Demandeur',
      });
    } else {
      setEditingId(null);
      setFormData(EMPTY_FORM);
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      const payload = { ...formData };
      // En mode édition, ne pas envoyer le mot de passe si vide
      if (editingId && !payload.password) {
        delete (payload as any).password;
      }
      if (editingId) {
        await demandeurService.update(editingId, payload);
      } else {
        await demandeurService.create(payload);
      }
      setShowModal(false);
      loadDemandeurs();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce demandeur ?')) {
      try {
        await demandeurService.delete(id);
        loadDemandeurs();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur');
      }
    }
  };

  const inputCls = 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5c38] text-sm';
  const labelCls = 'block text-sm font-medium text-gray-700 mb-1';

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
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Gestion Demandeurs</h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">Créer et gérer les comptes utilisateurs</p>
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="px-3 sm:px-4 py-2 bg-[#1a5c38] text-white rounded-lg hover:bg-opacity-90 transition font-medium text-xs sm:text-sm whitespace-nowrap"
            >
              + Ajouter
            </button>
          </div>

          {error && (
            <div className="p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
              <p className="text-red-800 text-xs sm:text-sm">{error}</p>
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-8 sm:py-12">
              <div className="animate-spin text-3xl sm:text-4xl mb-4">🔄</div>
              <p className="text-gray-600 text-sm">Chargement...</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {demandeurs.length === 0 ? (
                <div className="p-8 text-center text-gray-600 text-sm">
                  Aucun demandeur trouvé
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs sm:text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Nom complet</th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase hidden sm:table-cell">Email</th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase hidden md:table-cell">Téléphone</th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase hidden lg:table-cell">Service</th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase hidden lg:table-cell">Rôle</th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {demandeurs.map((d) => (
                        <tr key={d.id} className="hover:bg-gray-50 transition">
                          <td className="px-3 sm:px-6 py-3 sm:py-4 font-medium text-gray-900">
                            {d.first_name} {d.last_name}
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-600 hidden sm:table-cell">{d.email}</td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-600 hidden md:table-cell">{d.telephone}</td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-600 hidden lg:table-cell">{d.service}</td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 hidden lg:table-cell">
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                              {d.role}
                            </span>
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 space-x-2">
                            <button
                              onClick={() => handleOpenModal(d)}
                              className="text-[#1a5c38] hover:underline font-medium text-xs sm:text-sm"
                            >
                              Éditer
                            </button>
                            <button
                              onClick={() => handleDelete(d.id)}
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
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium text-sm"
            >
              Annuler
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-[#1a5c38] text-white rounded-lg hover:bg-opacity-90 transition font-medium text-sm"
            >
              Enregistrer
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Prénom *</label>
              <input
                type="text"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                className={inputCls}
                placeholder="Prénom"
              />
            </div>
            <div>
              <label className={labelCls}>Nom *</label>
              <input
                type="text"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                className={inputCls}
                placeholder="Nom de famille"
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={inputCls}
              placeholder="email@ucpsante.mg"
            />
          </div>

          <div>
            <label className={labelCls}>Nom d'utilisateur *</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className={inputCls}
              placeholder="ex: jrakoto"
            />
          </div>

          <div>
            <label className={labelCls}>
              {editingId ? 'Nouveau mot de passe (laisser vide = inchangé)' : 'Mot de passe *'}
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className={inputCls}
              placeholder={editingId ? 'Laisser vide pour ne pas changer' : 'Mot de passe'}
            />
          </div>

          <div>
            <label className={labelCls}>Téléphone</label>
            <input
              type="tel"
              value={formData.telephone}
              onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
              className={inputCls}
              placeholder="+261 34 00 000 00"
            />
          </div>

          <div>
            <label className={labelCls}>Service / Département</label>
            <input
              type="text"
              value={formData.service}
              onChange={(e) => setFormData({ ...formData, service: e.target.value })}
              className={inputCls}
              placeholder="ex: Santé communautaire"
            />
          </div>

          <div>
            <label className={labelCls}>Poste</label>
            <input
              type="text"
              value={formData.poste}
              onChange={(e) => setFormData({ ...formData, poste: e.target.value })}
              className={inputCls}
              placeholder="ex: Coordinateur de zone"
            />
          </div>

          <div>
            <label className={labelCls}>Rôle *</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className={inputCls}
            >
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
}