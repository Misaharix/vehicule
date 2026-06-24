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
  Mail, 
  Shield, 
  Briefcase, 
  Phone, 
  Edit2, 
  UserMinus, 
  AlertTriangle, 
  Users,
  Layers,
  Lock,
  User
} from 'lucide-react'

interface Demandeur {
  id: number
  username: string
  first_name: string
  last_name: string
  email: string
  role: string
  poste: string
  service: string
  telephone: string
  chef_direct: number | null
  chef_direct_nom: string | null
  is_active: boolean
}

const ROLES = ['Demandeur', 'Chef', 'Logistique', 'Directeur']

export default function DemandeursAdminPage() {
  const router = useRouter()
  const { isAdminAuthenticated, isLoading: authLoading } = useAuth()
  const [demandeurs, setDemandeurs] = useState<Demandeur[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState({
    username: '', first_name: '', last_name: '', email: '',
    role: 'Demandeur', poste: '', service: '',
    telephone: '', chef_direct: null as number | null,
  })

  useEffect(() => {
    if (!authLoading && !isAdminAuthenticated) router.push('/login')
  }, [authLoading, isAdminAuthenticated, router])

  useEffect(() => {
    if (isAdminAuthenticated) load()
  }, [isAdminAuthenticated])

  const load = async () => {
    try {
      setIsLoading(true)
      const data = await adminService.getDemandeurs()
      setDemandeurs(data)
    } catch { 
      setError('Erreur lors du chargement des demandeurs') 
    } finally { 
      setIsLoading(false) 
    }
  }

  const handleOpen = (d?: Demandeur) => {
    if (d) {
      setEditingId(d.id)
      setForm({ 
        username: d.username, first_name: d.first_name, last_name: d.last_name,
        email: d.email, role: d.role, poste: d.poste,
        service: d.service, telephone: d.telephone, chef_direct: d.chef_direct 
      })
    } else {
      setEditingId(null)
      setForm({ 
        username: '', first_name: '', last_name: '', email: '',
        role: 'Demandeur', poste: '', service: '', telephone: '', chef_direct: null 
      })
    }
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  try {
    setError('')
    if (editingId) {
      const { username, ...rest } = form  // ← plus de password à exclure
      await adminService.modifierDemandeur(editingId, rest)
    } else {
      await adminService.creerDemandeur(form)  // ← pas de password dans form
    }
    setShowModal(false)
    load()
  } catch (err: any) {
    const data = err.response?.data
    if (data) setError(Object.values(data).flat().join(', '))
    else setError('Erreur lors de l\'enregistrement')
  }
}

  const handleDelete = async (id: number) => {
    if (!confirm('Voulez-vous vraiment désactiver ce compte utilisateur ?')) return
    try {
      await adminService.desactiverDemandeur(id)
      load()
    } catch { 
      setError('Impossible de modifier le statut de ce compte') 
    }
  }

  const chefs = demandeurs.filter(d => d.role === 'Chef')

  // Couleur de badge dynamique selon le rôle
  const getRoleColor = (role: string) => {
    switch(role) {
      case 'Directeur': return 'bg-purple-50 text-purple-700 border-purple-100'
      case 'Logistique': return 'bg-blue-50 text-blue-700 border-blue-100'
      case 'Chef': return 'bg-orange-50 text-orange-700 border-orange-100'
      default: return 'bg-emerald-50 text-emerald-700 border-emerald-100'
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
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">Gestion Demandeurs</h1>
              <p className="text-gray-500 text-xs sm:text-sm mt-0.5">{demandeurs.length} utilisateur(s) enregistré(s)</p>
            </div>
            <button 
              onClick={() => handleOpen()}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1a5c38] text-white rounded-xl text-xs font-bold shadow-sm shadow-green-900/10 hover:bg-[#113f26] active:scale-95 transition-all w-full sm:w-auto"
            >
              <UserPlus className="w-4 h-4" />
              Ajouter un utilisateur
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
          ) : (
            <>
              {/* 1. VUE RESPONSIVE MOBILE : Liste de cartes (< sm) */}
              <div className="block sm:hidden space-y-3 mb-6">
                {demandeurs.map(d => (
                  <div key={d.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-3 relative overflow-hidden">
                    <div className="absolute top-4 right-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border ${getRoleColor(d.role)}`}>
                        {d.role}
                      </span>
                    </div>

                    <div>
                      <p className="font-extrabold text-gray-900 text-sm leading-tight">{d.first_name} {d.last_name}</p>
                      <p className="text-[11px] text-gray-400 font-mono mt-0.5">@{d.username}</p>
                    </div>

                    <div className="space-y-1.5 text-xs text-gray-500 font-medium pt-1">
                      <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-gray-400" /> <span className="truncate">{d.email}</span></div>
                      <div className="flex items-center gap-2"><Briefcase className="w-3.5 h-3.5 text-gray-400" /> <span>{d.poste || '-'} ({d.service || '-'})</span></div>
                      {d.telephone && <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-gray-400" /> <span>{d.telephone}</span></div>}
                    </div>

                    <div className="pt-3 border-t border-gray-50 flex items-center justify-between">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                        d.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                      }`}>
                        {d.is_active ? 'Actif' : 'Inactif'}
                      </span>
                      <div className="flex gap-2">
                        <button onClick={() => handleOpen(d)} className="inline-flex items-center gap-1 text-xs font-bold text-[#1a5c38] bg-green-50 px-2.5 py-1.5 rounded-lg border border-green-100">
                          <Edit2 className="w-3 h-3" /> Éditer
                        </button>
                        {d.is_active && (
                          <button onClick={() => handleDelete(d.id)} className="inline-flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1.5 rounded-lg border border-red-100">
                            <UserMinus className="w-3 h-3" /> Bloquer
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 2. VUE RESPONSIVE DESKTOP : Grand Tableau (>= sm) */}
              <div className="hidden sm:block bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-gray-50/70 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                      <tr>
                        {['Utilisateur', 'Adresse Email', 'Rôle', 'Poste / Service', 'Statut', 'Actions'].map(h => (
                          <th key={h} className="px-5 py-4 font-bold text-[10px]">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 font-medium text-gray-700">
                      {demandeurs.map(d => (
                        <tr key={d.id} className="hover:bg-gray-50/60 transition-colors group">
                          <td className="px-5 py-3.5 font-extrabold text-gray-900 flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 text-[10px] font-black group-hover:bg-[#1a5c38] group-hover:text-white transition-colors">
                              {d.first_name[0]}{d.last_name[0]}
                            </div>
                            <div>
                              <p className="font-black text-gray-900">{d.first_name} {d.last_name}</p>
                              <p className="text-[10px] font-mono text-gray-400 font-normal mt-0.5">@{d.username}</p>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-gray-500 font-mono text-[11px]">{d.email}</td>
                          <td className="px-5 py-3.5">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wider ${getRoleColor(d.role)}`}>
                              {d.role}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-gray-500">
                            <p className="font-bold text-gray-800 text-[11px]">{d.poste || '-'}</p>
                            <p className="text-[10px] text-gray-400 font-normal">{d.service || '-'}</p>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border ${
                              d.is_active ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'
                            }`}>
                              <span className={`w-1 h-1 rounded-full ${d.is_active ? 'bg-emerald-500' : 'bg-red-500'}`} />
                              {d.is_active ? 'Actif' : 'Suspendu'}
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => handleOpen(d)} 
                                className="p-1.5 hover:bg-gray-100 text-gray-600 hover:text-[#1a5c38] rounded-md transition-all"
                                title="Modifier"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              {d.is_active && (
                                <button 
                                  onClick={() => handleDelete(d.id)} 
                                  className="p-1.5 hover:bg-red-50 text-gray-600 hover:text-red-600 rounded-md transition-all"
                                  title="Désactiver"
                                >
                                  <UserMinus className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      {/* MODAL COMPOSANT */}
      <Modal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)}
        title={editingId ? 'Modifier le profil utilisateur' : 'Créer un nouvel utilisateur interne'} 
        size="lg"
        actions={
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
              form="demandeur-form"
              className="w-full sm:w-auto px-4 py-2 bg-[#1a5c38] text-white rounded-xl text-xs font-bold hover:bg-[#113f26] transition-colors shadow-sm"
            >
              Enregistrer
            </button>
          </div>
        }
      >
        <form id="demandeur-form" className="space-y-4 py-2" onSubmit={handleSubmit}>
          
          {/* Prénom & Nom */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5">Prénom</label>
              <div className="relative">
                <input required value={form.first_name} onChange={e => setForm(p => ({ ...p, first_name: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-gray-100 bg-gray-50/50 rounded-xl text-xs font-semibold text-gray-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#1a5c38]/20 focus:border-[#1a5c38] transition-all" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5">Nom de famille</label>
              <input required value={form.last_name} onChange={e => setForm(p => ({ ...p, last_name: e.target.value }))}
                className="w-full px-3 py-2.5 border border-gray-100 bg-gray-50/50 rounded-xl text-xs font-semibold text-gray-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#1a5c38]/20 focus:border-[#1a5c38] transition-all" />
            </div>
          </div>

          {/* Identifiant unique (Seulement à la création) */}
          {!editingId && (
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5">Nom d'utilisateur (ID Unique)</label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-400 text-xs font-mono">@</span>
                <input required value={form.username} onChange={e => setForm(p => ({ ...p, username: e.target.value }))}
                  className="w-full pl-7 pr-3 py-2.5 border border-gray-100 bg-gray-50/50 rounded-xl text-xs font-mono text-gray-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#1a5c38]/20 focus:border-[#1a5c38] transition-all" placeholder="j.dupont" />
              </div>
            </div>
          )}

          {/* Adresse email professionnelle */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5">Adresse Email</label>
            <input type="email" required value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              className="w-full px-3 py-2.5 border border-gray-100 bg-gray-50/50 rounded-xl text-xs font-semibold text-gray-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#1a5c38]/20 focus:border-[#1a5c38] transition-all" placeholder="exemple@entreprise.com" />
          </div>

          {/* Mot de passe (Seulement à la création) */}
          {!editingId && (
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-700 font-medium">
              🔐 Un mot de passe temporaire sera généré automatiquement et envoyé par email à l'utilisateur.
            </div>
          )}

          {/* Rôle applicatif & Chef Direct */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5">Rôle Système</label>
              <div className="relative">
                <Shield className="w-3.5 h-3.5 absolute left-3 top-3.5 text-gray-400 pointer-events-none" />
                <select value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-100 bg-gray-50/50 rounded-xl text-xs font-bold text-gray-800 appearance-none focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#1a5c38]/20 focus:border-[#1a5c38] transition-all">
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5">Supérieur / Chef direct</label>
              <div className="relative">
                <User className="w-3.5 h-3.5 absolute left-3 top-3.5 text-gray-400 pointer-events-none" />
                <select value={form.chef_direct || ''} onChange={e => setForm(p => ({ ...p, chef_direct: Number(e.target.value) || null }))}
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-100 bg-gray-50/50 rounded-xl text-xs font-bold text-gray-800 appearance-none focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#1a5c38]/20 focus:border-[#1a5c38] transition-all">
                  <option value="">-- Aucun Manager --</option>
                  {chefs.map(c => <option key={c.id} value={c.id}>{c.first_name} {c.last_name}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Poste occupé */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5">Intitulé du Poste</label>
            <input value={form.poste} onChange={e => setForm(p => ({ ...p, poste: e.target.value }))}
              className="w-full px-3 py-2.5 border border-gray-100 bg-gray-50/50 rounded-xl text-xs font-semibold text-gray-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#1a5c38]/20 focus:border-[#1a5c38] transition-all" placeholder="Ex: Chef de Projet Logistique" />
          </div>

          {/* Service & Téléphone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5">Département / Service</label>
              <div className="relative">
                <Layers className="w-3.5 h-3.5 absolute left-3 top-3.5 text-gray-400 pointer-events-none" />
                <input value={form.service} onChange={e => setForm(p => ({ ...p, service: e.target.value }))}
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-100 bg-gray-50/50 rounded-xl text-xs font-semibold text-gray-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#1a5c38]/20 focus:border-[#1a5c38] transition-all" placeholder="Ex: Ressources Humaines" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5">Ligne Téléphonique</label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 absolute left-3 top-3.5 text-gray-400 pointer-events-none" />
                <input type="tel" value={form.telephone} onChange={e => setForm(p => ({ ...p, telephone: e.target.value }))}
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-100 bg-gray-50/50 rounded-xl text-xs font-mono text-gray-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#1a5c38]/20 focus:border-[#1a5c38] transition-all" placeholder="Ex: +33 1 00 00 00" />
              </div>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  )
}