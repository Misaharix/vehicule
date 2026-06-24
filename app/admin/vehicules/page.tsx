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
  Car, 
  Plus, 
  Edit2, 
  Trash2, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle,
  Hash
} from 'lucide-react'

interface Vehicule { 
  id: number; 
  immatriculation: string; 
  marque: string; 
  modele: string; 
  disponible: boolean 
}

export default function VehiculesAdminPage() {
  const router = useRouter()
  const { isAdminAuthenticated, isLoading: authLoading } = useAuth()
  const [vehicules, setVehicules] = useState<Vehicule[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState({ immatriculation: '', marque: '', modele: '', disponible: true })

  useEffect(() => { 
    if (!authLoading && !isAdminAuthenticated) router.push('/login') 
  }, [authLoading, isAdminAuthenticated, router])

  useEffect(() => { 
    if (isAdminAuthenticated) load() 
  }, [isAdminAuthenticated])

  const load = async () => {
    try { 
      setIsLoading(true)
      const data = await adminService.getVehicules()
      setVehicules(data) 
    } catch { 
      setError('Erreur lors du chargement des véhicules') 
    } finally { 
      setIsLoading(false) 
    }
  }

  const handleOpen = (v?: Vehicule) => {
    if (v) { 
      setEditingId(v.id)
      setForm({ immatriculation: v.immatriculation, marque: v.marque, modele: v.modele, disponible: v.disponible }) 
    } else { 
      setEditingId(null)
      setForm({ immatriculation: '', marque: '', modele: '', disponible: true }) 
    }
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) await adminService.modifierVehicule(editingId, form)
      else await adminService.creerVehicule(form)
      setShowModal(false)
      load()
    } catch { 
      setError("Erreur lors de l'enregistrement du véhicule") 
    }
  }

  const handleToggleActive = async (id: number) => {
    if (confirm('Voulez-vous vraiment désactiver ou retirer ce véhicule ?')) {
      try {
        await adminService.desactiverVehicule(id)
        load()
      } catch {
        setError('Impossible de désactiver ce véhicule')
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
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">Gestion Véhicules</h1>
              <p className="text-gray-500 text-xs sm:text-sm mt-0.5">Suivez l'état de votre parc automobile en temps réel</p>
            </div>
            <button 
              onClick={() => handleOpen()} 
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1a5c38] text-white rounded-xl text-xs font-bold shadow-sm shadow-green-900/10 hover:bg-[#113f26] active:scale-95 transition-all w-full sm:w-auto"
            >
              <Plus className="w-4 h-4" />
              Ajouter un véhicule
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
          ) : vehicules.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 p-6 flex flex-col items-center justify-center gap-2 shadow-sm">
              <Car className="w-10 h-10 text-gray-300" />
              <p className="text-gray-900 font-extrabold text-sm">Aucun véhicule enregistré</p>
              <p className="text-gray-400 text-xs">Ajoutez un premier véhicule pour initialiser le parc.</p>
            </div>
          ) : (
            <>
              {/* VUE MOBILE : Cartes empilées et flexibles (< sm) */}
              <div className="block sm:hidden space-y-3 mb-6">
                {vehicules.map(v => (
                  <div key={v.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-3 relative overflow-hidden">
                    <div className="absolute top-0 right-0 pt-3 pr-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                        v.disponible ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
                      }`}>
                        {v.disponible ? 'Opérationnel' : 'Au garage'}
                      </span>
                    </div>
                    <div>
                      <p className="font-extrabold text-gray-900 text-sm">{v.marque} <span className="font-medium text-gray-500">{v.modele}</span></p>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-gray-600 bg-gray-50 px-2 py-1 rounded-md w-max border border-gray-100">
                      <Hash className="w-3.5 h-3.5 text-gray-400" />
                      <span>{v.immatriculation}</span>
                    </div>
                    <div className="pt-3 border-t border-gray-50 flex items-center justify-end gap-3">
                      <button onClick={() => handleOpen(v)} className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1a5c38] bg-green-50 px-2.5 py-1.5 rounded-lg border border-green-100">
                        <Edit2 className="w-3.5 h-3.5" /> Éditer
                      </button>
                      <button onClick={() => handleToggleActive(v.id)} className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1.5 rounded-lg border border-red-100">
                        <Trash2 className="w-3.5 h-3.5" /> Retirer
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* VUE DESKTOP : Tableau structuré (>= sm) */}
              <div className="hidden sm:block bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-gray-50/70 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                    <tr>
                      {['Véhicule', 'Immatriculation', 'Statut du Parc', 'Actions'].map(h => (
                        <th key={h} className="px-5 py-4 font-bold text-[10px]">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 font-medium text-gray-700">
                    {vehicules.map(v => (
                      <tr key={v.id} className="hover:bg-gray-50/60 transition-colors group">
                        <td className="px-5 py-3.5 font-extrabold text-gray-900 flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-[#1a5c38] group-hover:text-white transition-colors">
                            <Car className="w-3.5 h-3.5" />
                          </div>
                          <span className="capitalize">{v.marque}</span>
                          <span className="text-gray-400 font-normal">{v.modele}</span>
                        </td>
                        <td className="px-5 py-3.5 text-gray-600 font-mono text-[11px] font-bold">{v.immatriculation}</td>
                        <td className="px-5 py-3.5">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border ${
                            v.disponible 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                              : 'bg-red-50 text-red-700 border-red-100'
                          }`}>
                            <span className={`w-1 h-1 rounded-full ${v.disponible ? 'bg-emerald-500' : 'bg-red-500'}`} />
                            {v.disponible ? 'Disponible' : 'Indisponible'}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => handleOpen(v)} 
                              className="p-1.5 hover:bg-gray-100 text-gray-600 hover:text-[#1a5c38] rounded-md transition-all"
                              title="Modifier"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => handleToggleActive(v.id)} 
                              className="p-1.5 hover:bg-red-50 text-gray-600 hover:text-red-600 rounded-md transition-all"
                              title="Désactiver"
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

      {/* MODAL FORMULAIRE */}
      <Modal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        title={editingId ? 'Modifier la fiche véhicule' : 'Enregistrer un nouveau véhicule'} 
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
              form="vehicule-form"
              className="w-full sm:w-auto px-4 py-2 bg-[#1a5c38] text-white rounded-xl text-xs font-bold hover:bg-[#113f26] transition-colors shadow-sm"
            >
              Enregistrer
            </button>
          </div>
        )}
      >
        <form id="vehicule-form" className="space-y-4 py-2" onSubmit={handleSubmit}>
          {[
            { label: 'Constructeur / Marque', key: 'marque', placeholder: 'Ex: Toyota' },
            { label: 'Modèle du véhicule', key: 'modele', placeholder: 'Ex: Hilux' },
            { label: 'Numéro d\'immatriculation', key: 'immatriculation', placeholder: 'Ex: AA-123-AA' },
          ].map(({ label, key, placeholder }) => (
            <div key={key}>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5">{label}</label>
              <input 
                type="text"
                required
                placeholder={placeholder}
                value={(form as any)[key]} 
                onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} 
                className="w-full px-3 py-2.5 border border-gray-100 bg-gray-50/50 rounded-xl text-xs font-semibold text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#1a5c38]/20 focus:border-[#1a5c38] transition-all" 
              />
            </div>
          ))}

          {/* Switch de disponibilité stylisé */}
          <div className="pt-2">
            <label className="flex items-center gap-3 cursor-pointer select-none group w-max">
              <div className="relative">
                <input 
                  type="checkbox" 
                  checked={form.disponible} 
                  onChange={e => setForm(p => ({ ...p, disponible: e.target.checked }))} 
                  className="sr-only" 
                  id="dispo-toggle"
                />
                <div className={`w-10 h-6 rounded-full transition-colors ${form.disponible ? 'bg-[#1a5c38]' : 'bg-gray-200'}`}></div>
                <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${form.disponible ? 'translate-x-4' : ''}`}></div>
              </div>
              <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                {form.disponible ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Véhicule opérationnel immédiatement
                  </>
                ) : (
                  <>
                    <XCircle className="w-3.5 h-3.5 text-red-500" /> Véhicule immobilisé (En panne / En maintenance)
                  </>
                )}
              </span>
            </label>
          </div>
        </form>
      </Modal>
    </div>
  )
}