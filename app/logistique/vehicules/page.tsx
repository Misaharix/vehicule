'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useRole } from '@/hooks/useRole'
import { Navbar } from '@/components/Navbar'
import { Sidebar } from '@/components/Sidebar'
import { MissionsEnCours } from '@/components/MissionEnCours'
import { Modal } from '@/components/Modal'
import vehiculeService from '@/services/vehiculeService'
// Installation requise : npm install lucide-react
import { 
  Car, 
  Plus, 
  Edit2, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Hash,
  ChevronRight
} from 'lucide-react'

interface Vehicule {
  id: number
  immatriculation: string
  marque: string
  modele: string
  disponible: boolean
}

export default function VehiculesPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { isLogistique } = useRole()
  const [vehicules, setVehicules] = useState<Vehicule[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState({ immatriculation: '', marque: '', modele: '', disponible: true })

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push('/login')
  }, [authLoading, isAuthenticated, router])

  useEffect(() => {
    if (isAuthenticated) load()
  }, [isAuthenticated])

  const load = async () => {
    try {
      setIsLoading(true)
      setVehicules(await vehiculeService.getAll())
    } catch {
      setError('Erreur lors du chargement des données')
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
      if (editingId) await vehiculeService.modifier(editingId, form)
      else await vehiculeService.creer(form)
      setShowModal(false)
      load()
    } catch {
      setError('Erreur lors de l\'enregistrement')
    }
  }

  if (authLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-[#1a5c38] rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium text-sm">Vérification des accès...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)]">
        <Sidebar />
        
        {/* main : Adaptabilité responsive intelligente de la marge de droite (uniquement si panel actif et sur grand écran) */}
        <main className={`flex-1 p-4 sm:p-6 lg:p-10 transition-all ${isLogistique ? 'lg:mr-80' : ''}`}>
          
          {/* Top Bar / Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <span className="text-[10px] uppercase tracking-[2px] font-bold text-gray-400">Parc Automobile</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-0.5">Gestion Véhicules</h1>
              <p className="text-gray-500 text-xs sm:text-sm mt-1">
                <span className="font-bold text-[#1a5c38] bg-green-50 px-2 py-0.5 rounded-md border border-green-100">{vehicules.length}</span> véhicule(s) enregistré(s) au total
              </p>
            </div>
            <button
              onClick={() => handleOpen()}
              className="w-full sm:w-auto px-4 py-2.5 bg-[#1a5c38] text-white rounded-xl text-sm font-bold hover:bg-[#0d3d22] transition-all flex items-center justify-center gap-2 shadow-sm shadow-green-100"
            >
              <Plus className="w-4 h-4" /> Ajouter un véhicule
            </button>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl mb-6 text-red-700 text-sm flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <p className="font-medium">{error}</p>
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center py-20">
               <div className="w-10 h-10 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {vehicules.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-sm flex flex-col items-center justify-center gap-3">
                  <Car className="w-12 h-12 text-gray-300" />
                  <p className="text-gray-500 font-medium">Aucun véhicule trouvé dans la base de données.</p>
                </div>
              ) : (
                <>
                  {/* VUE MOBILE (Cartes empilées visibles uniquement sur petits écrans) */}
                  <div className="grid grid-cols-1 gap-4 md:hidden">
                    {vehicules.map(v => (
                      <div key={v.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4 relative overflow-hidden">
                        {/* Petite bordure d'accentuation calquée sur Oovoom */}
                        <div className={`absolute top-0 left-0 right-0 h-1.5 ${v.disponible ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        
                        <div className="flex justify-between items-start pt-1">
                          <div>
                            <h3 className="font-extrabold text-gray-900 text-base">{v.marque}</h3>
                            <p className="text-gray-500 text-xs font-medium">{v.modele}</p>
                          </div>
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1.5 uppercase tracking-wider ${
                            v.disponible 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                              : 'bg-red-50 text-red-700 border-red-100'
                          }`}>
                            {v.disponible ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                            {v.disponible ? 'Disponible' : 'Indisponible'}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-2 rounded-xl text-xs font-mono text-gray-600 w-fit">
                          <Hash className="w-3.5 h-3.5 text-gray-400" />
                          {v.immatriculation}
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-50">
                          <button
                            onClick={() => handleOpen(v)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg hover:bg-green-50 hover:text-[#1a5c38] text-xs font-bold transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" /> Modifier
                          </button>
                          <button
                            onClick={async () => {
                              if (confirm('Supprimer ce véhicule ?')) {
                                await vehiculeService.desactiver(v.id)
                                load()
                              }
                            }}
                            className="flex items-center gap-1 px-3 py-1.5 bg-red-50/50 text-red-600 rounded-lg hover:bg-red-100 text-xs font-bold transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Supprimer
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* VUE TABLETTE & DESKTOP (Table classique cachée sur mobile) */}
                  <div className="hidden md:block bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50/70 border-b border-gray-100">
                        <tr>
                          {['Marque / Modèle', 'Immatriculation', 'Statut de Disponibilité', 'Actions'].map((h, i) => (
                            <th key={h} className={`px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest ${i === 3 ? 'text-right' : ''}`}>
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {vehicules.map(v => (
                          <tr key={v.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400">
                                  <Car className="w-5 h-5" />
                                </div>
                                <div>
                                  <p className="font-bold text-gray-900">{v.marque}</p>
                                  <p className="text-gray-400 text-xs">{v.modele}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="font-mono text-xs bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-lg text-gray-600 font-semibold">
                                {v.immatriculation}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border uppercase tracking-wider ${
                                v.disponible 
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                                  : 'bg-red-50 text-red-700 border-red-100'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${v.disponible ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                {v.disponible ? 'Disponible' : 'Indisponible'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="inline-flex items-center gap-2">
                                <button
                                  onClick={() => handleOpen(v)}
                                  className="p-2 bg-gray-50 text-gray-500 rounded-xl hover:bg-green-50 hover:text-[#1a5c38] transition-all"
                                  title="Modifier"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={async () => {
                                    if (confirm('Supprimer ce véhicule ?')) {
                                      await vehiculeService.desactiver(v.id)
                                      load()
                                    }
                                  }}
                                  className="p-2 bg-gray-50 text-gray-500 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all"
                                  title="Supprimer"
                                >
                                  <Trash2 className="w-4 h-4" />
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
            </>
          )}
        </main>

        {isLogistique && <MissionsEnCours />}
      </div>

      {/* Modal Re-stylisé */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingId ? 'Modifier le véhicule' : 'Ajouter un nouveau véhicule'}
        size="md"
        actions={
          <div className="flex gap-3 justify-end w-full">
            <button 
              onClick={() => setShowModal(false)} 
              className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button 
              onClick={handleSubmit} 
              className="px-4 py-2 bg-[#1a5c38] hover:bg-[#0d3d22] text-white rounded-xl text-sm font-semibold shadow-sm transition-colors"
            >
              Enregistrer
            </button>
          </div>
        }
      >
        <form className="space-y-5" onSubmit={e => e.preventDefault()}>
          {([['Marque du véhicule', 'marque'], ['Modèle précis', 'modele'], ['Immatriculation', 'immatriculation']] as [string, string][]).map(([label, key]) => (
            <div key={key}>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">{label}</label>
              <input
                value={(form as any)[key]}
                onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                placeholder={`Ex: ${label.split(' ')[0]}`}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#1a5c38]/20 focus:border-[#1a5c38] transition-all text-gray-900 placeholder-gray-400 font-medium"
              />
            </div>
          ))}
          
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200/60 mt-2">
            <label className="flex items-center gap-3 text-sm font-bold text-gray-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={form.disponible}
                onChange={e => setForm(p => ({ ...p, disponible: e.target.checked }))}
                className="w-4 h-4 rounded text-[#1a5c38] focus:ring-[#1a5c38] border-gray-300 accent-[#1a5c38]"
              />
              <div>
                <p className="text-gray-900 text-xs uppercase tracking-wider font-bold">Activer la disponibilité</p>
                <p className="text-gray-400 text-[11px] font-normal mt-0.5">Le véhicule sera immédiatement attribuable à de nouvelles missions.</p>
              </div>
            </label>
          </div>
        </form>
      </Modal>
    </div>
  )
}