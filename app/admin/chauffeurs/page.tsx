'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Navbar } from '@/components/Navbar'
import { Sidebar } from '@/components/Sidebar'
import { Modal } from '@/components/Modal'
import adminService from '@/services/adminService'
// Installation requise : npm install lucide-react
import { 
  UserPlus, 
  Phone, 
  Mail, 
  Edit2, 
  Trash2, 
  UserCheck, 
  AlertTriangle, 
  UserX 
} from 'lucide-react'

interface Chauffeur { 
  id: number; 
  nom: string; 
  prenom: string; 
  telephone: string; 
  email: string; 
  disponible: boolean 
}

<<<<<<< HEAD
export default function ChauffeurAdminPage() {
  const router = useRouter();
  const { isAdminAuthenticated, isLoading: authLoading } = useAuth();
  const [chauffeurs, setChauffeurs] = useState<Chauffeur[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',      // Requis par ton CreerChauffeurSerializer
    telephone: '',   // Requis par ton CreerChauffeurSerializer
    email: '',       // Requis par ton CreerChauffeurSerializer
    disponible: true,
  });
=======
export default function ChauffeursAdminPage() {
  const router = useRouter()
  const { isAdminAuthenticated, isLoading: authLoading } = useAuth()
  const [chauffeurs, setChauffeurs] = useState<Chauffeur[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState({ nom: '', prenom: '', telephone: '', email: '' })
>>>>>>> 6ece3617a5d71e903687e9e88c8b36404421f464

  useEffect(() => { 
    if (!authLoading && !isAdminAuthenticated) router.push('/login') 
  }, [authLoading, isAdminAuthenticated, router])

  useEffect(() => { 
    if (isAdminAuthenticated) load() 
  }, [isAdminAuthenticated])

  const load = async () => {
    try { 
      setIsLoading(true)
      const data = await adminService.getChauffeurs()
      setChauffeurs(data) 
    } catch { 
      setError('Erreur lors du chargement de la liste des chauffeurs') 
    } finally { 
      setIsLoading(false) 
    }
<<<<<<< HEAD
  }, [authLoading, isAdminAuthenticated, router]);

  useEffect(() => {
    if (isAdminAuthenticated) {
      loadChauffeurs();
    }
  }, [isAdminAuthenticated]);

  const loadChauffeurs = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await chauffeurService.getAll({ page_size: 100 });
      setChauffeurs(response.results);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (chauffeur?: Chauffeur) => {
    if (chauffeur) {
      setEditingId(chauffeur.id);
      setFormData({
        nom: chauffeur.nom,
        prenom: chauffeur.prenom || '',
        telephone: chauffeur.telephone,
        email: chauffeur.email || '',
        disponible: chauffeur.disponible,
      });
    } else {
      setEditingId(null);
      setFormData({
        nom: '',
        prenom: '',
        telephone: '',
        email: '',
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
        await chauffeurService.update(editingId, formData);
      } else {
        await chauffeurService.create(formData);
      }
      setShowModal(false);
      loadChauffeurs();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur';
      setError(errorMessage);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce chauffeur?')) {
      try {
        await chauffeurService.delete(id);
        loadChauffeurs();
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
=======
>>>>>>> 6ece3617a5d71e903687e9e88c8b36404421f464
  }

  const handleOpen = (c?: Chauffeur) => {
    if (c) { 
      setEditingId(c.id)
      setForm({ nom: c.nom, prenom: c.prenom, telephone: c.telephone, email: c.email }) 
    } else { 
      setEditingId(null)
      setForm({ nom: '', prenom: '', telephone: '', email: '' }) 
    }
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) await adminService.modifierChauffeur(editingId, form)
      else await adminService.creerChauffeur(form)
      setShowModal(false)
      load()
    } catch { 
      setError("Erreur lors de l'enregistrement des données") 
    }
  }

  const handleToggleActive = async (id: number) => {
    if (confirm('Voulez-vous vraiment désactiver ce chauffeur ?')) {
      try {
        await adminService.desactiverChauffeur(id)
        load()
      } catch {
        setError('Impossible de désactiver ce profil')
      }
    }
  }

  if (authLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-10 h-10 border-4 border-gray-200 border-t-[#1a5c38] rounded-full animate-spin"></div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)]">
        <Sidebar />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-10">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">Gestion Chauffeurs</h1>
              <p className="text-gray-500 text-xs sm:text-sm mt-0.5">Pilotez l'affectation et la disponibilité de vos conducteurs</p>
            </div>
            <button 
              onClick={() => handleOpen()} 
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1a5c38] text-white rounded-xl text-xs font-bold shadow-sm shadow-green-900/10 hover:bg-[#113f26] active:scale-95 transition-all w-full sm:w-auto"
            >
              <UserPlus className="w-4 h-4" />
              Ajouter un chauffeur
            </button>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl mb-6 text-red-700 text-xs font-semibold flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-3 border-gray-200 border-t-[#1a5c38] rounded-full animate-spin"></div>
            </div>
          ) : chauffeurs.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 p-6 flex flex-col items-center justify-center gap-2 shadow-sm">
              <UserX className="w-10 h-10 text-gray-300" />
              <p className="text-gray-900 font-extrabold text-sm">Aucun chauffeur</p>
              <p className="text-gray-400 text-xs">La base de données des conducteurs est vide.</p>
            </div>
          ) : (
            <>
              {/* 1. COMPOSANT RESPONSIVE : Version Cartes Empilées (Uniquement sur Mobiles < sm) */}
              <div className="block sm:hidden space-y-3 mb-6">
                {chauffeurs.map(c => (
                  <div key={c.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-3 relative overflow-hidden">
                    <div className="absolute top-0 right-0 pt-3 pr-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                        c.disponible ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
                      }`}>
                        {c.disponible ? 'Disponible' : 'Indisponible'}
                      </span>
                    </div>
                    <div>
                      <p className="font-extrabold text-gray-900 text-sm">{c.prenom} {c.nom}</p>
                    </div>
                    <div className="space-y-1 text-xs text-gray-500 font-medium">
                      <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-gray-400" /> <span>{c.telephone}</span></div>
                      <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-gray-400" /> <span className="truncate">{c.email || '-'}</span></div>
                    </div>
                    <div className="pt-3 border-t border-gray-50 flex items-center justify-end gap-3">
                      <button onClick={() => handleOpen(c)} className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1a5c38] bg-green-50 px-2.5 py-1.5 rounded-lg border border-green-100">
                        <Edit2 className="w-3.5 h-3.5" /> Éditer
                      </button>
                      <button onClick={() => handleToggleActive(c.id)} className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1.5 rounded-lg border border-red-100">
                        <Trash2 className="w-3.5 h-3.5" /> Retirer
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* 2. COMPOSANT RESPONSIVE : Version Tableau Standard (À partir de l'écran sm) */}
              <div className="hidden sm:block bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-gray-50/70 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                    <tr>
                      {['Chauffeur', 'Téléphone', 'Adresse Email', 'Statut', 'Actions'].map(h => (
                        <th key={h} className="px-5 py-4 font-bold text-[10px]">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 font-medium text-gray-700">
                    {chauffeurs.map(c => (
                      <tr key={c.id} className="hover:bg-gray-50/60 transition-colors group">
                        <td className="px-5 py-3.5 font-extrabold text-gray-900 flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 text-[10px] uppercase font-black group-hover:bg-[#1a5c38] group-hover:text-white transition-colors">
                            {c.nom[0]}
                          </div>
                          {c.prenom} {c.nom}
                        </td>
                        <td className="px-5 py-3.5 text-gray-500 font-mono text-[11px]">{c.telephone}</td>
                        <td className="px-5 py-3.5 text-gray-500 truncate max-w-[200px]">{c.email || '-'}</td>
                        <td className="px-5 py-3.5">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border ${
                            c.disponible 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                              : 'bg-red-50 text-red-700 border-red-100'
                          }`}>
                            <span className={`w-1 h-1 rounded-full ${c.disponible ? 'bg-emerald-500' : 'bg-red-500'}`} />
                            {c.disponible ? 'En service' : 'Indisponible'}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => handleOpen(c)} 
                              className="p-1.5 hover:bg-gray-100 text-gray-600 hover:text-[#1a5c38] rounded-md transition-all"
                              title="Modifier"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => handleToggleActive(c.id)} 
                              className="p-1.5 hover:bg-red-50 text-gray-600 hover:text-red-600 rounded-md transition-all"
                              title="Supprimer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </main>
      </div>

      {/* Modal Re-Stylisé */}
      <Modal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        title={editingId ? 'Modifier les données' : 'Enregistrer un chauffeur'} 
        size="md"
        actions={(
          <div className="flex w-full sm:w-auto items-center justify-end gap-2">
            <button 
              type="button"
              onClick={() => setShowModal(false)} 
              className="w-full sm:w-auto px-4 py-2 border border-gray-200 text-gray-500 rounded-xl text-xs font-bold hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button 
              type="submit"
              form="chauffeur-form" // Relie le bouton au formulaire ci-dessous
              className="w-full sm:w-auto px-4 py-2 bg-[#1a5c38] text-white rounded-xl text-xs font-bold hover:bg-[#113f26] transition-colors shadow-sm"
            >
              Enregistrer
            </button>
          </div>
        )}
      >
<<<<<<< HEAD
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
            <input
              type="text"
              value={formData.prenom}
              onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5c38]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
            <input
              type="tel"
              value={formData.telephone}
              onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
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
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                checked={formData.disponible}
                onChange={(e) => setFormData({ ...formData, disponible: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300"
=======
        <form id="chauffeur-form" className="space-y-4 py-2" onSubmit={handleSubmit}>
          {[
            { label: 'Prénom', key: 'prenom', type: 'text', placeholder: 'Ex: Jean' },
            { label: 'Nom de famille', key: 'nom', type: 'text', placeholder: 'Ex: Dupont' },
            { label: 'Numéro de téléphone', key: 'telephone', type: 'tel', placeholder: 'Ex: +33 6 ...' },
            { label: 'Adresse Email', key: 'email', type: 'email', placeholder: 'Ex: jean.dupont@sante.fr' },
          ].map(({ label, key, type, placeholder }) => (
            <div key={key}>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5">{label}</label>
              <input 
                type={type}
                required={key !== 'email'} // Email optionnel, le reste obligatoire
                placeholder={placeholder}
                value={(form as any)[key]} 
                onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} 
                className="w-full px-3 py-2.5 border border-gray-100 bg-gray-50/50 rounded-xl text-xs font-semibold text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#1a5c38]/20 focus:border-[#1a5c38] transition-all" 
>>>>>>> 6ece3617a5d71e903687e9e88c8b36404421f464
              />
            </div>
          ))}
        </form>
      </Modal>
    </div>
  )
}