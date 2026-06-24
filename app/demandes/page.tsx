'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Navbar } from '@/components/Navbar'
import { Sidebar } from '@/components/Sidebar'
import { DemandeCard } from '@/components/DemandeCard'
import demandeService from '@/services/demandeService'
import { DemandeVehicule } from '@/types'
import Link from 'next/link'
import { Plus, ClipboardList, AlertCircle } from 'lucide-react'

export default function DemandesPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const [demandes, setDemandes] = useState<DemandeVehicule[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [filtre, setFiltre] = useState('tous')

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push('/login')
  }, [authLoading, isAuthenticated, router])

  useEffect(() => {
    if (isAuthenticated) loadDemandes()
  }, [isAuthenticated])

  const loadDemandes = async () => {
    try {
      setIsLoading(true)
      const data = await demandeService.getMesDemandes()
      setDemandes(data)
    } catch {
      setError('Erreur lors du chargement des demandes')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnnuler = async (id: number) => {
    if (!confirm('Annuler cette demande ?')) return
    try {
      await demandeService.annulerDemande(id)
      loadDemandes()
    } catch {
      setError("Erreur lors de l'annulation de la demande")
    }
  }

  const demandesFiltrees = filtre === 'tous'
    ? demandes
    : demandes.filter(d => d.statut === filtre)

  if (authLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-10 h-10 border-4 border-gray-100 border-t-[#00b074] rounded-full animate-spin"></div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-gray-800 font-sans">
      <Navbar />
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)]">
        <Sidebar />
        
        {/* Conteneur principal blanc et arrondi calqué sur l'interface de droite de dashboard.jpg */}
        <main className="flex-1 bg-white m-4 lg:m-6 p-5 sm:p-6 lg:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
          
          {/* Header responsive */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                Mes demandes de véhicule
              </h1>
              <p className="text-gray-400 text-xs mt-0.5 font-medium">
                {demandes.length} dossier(s) au total
              </p>
            </div>
            
            <Link 
              href="/demandes/new"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#00b074] text-white rounded-xl text-xs font-bold hover:bg-[#008f5d] transition-all shadow-md shadow-emerald-500/10"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" /> Nouvelle demande
            </Link>
          </div>

          {/* Section Filtres au style Pilules épurées */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none flex-nowrap sm:flex-wrap mask-linear-edge">
            {[
              { key: 'tous', label: 'Toutes', color: 'bg-[#00b074]' },
              { key: 'en_attente', label: 'En attente', color: 'bg-[#18a0fb]' },
              { key: 'approuvee', label: 'Approuvées', color: 'bg-[#7b61ff]' },
              { key: 'rejetee', label: 'Rejetées', color: 'bg-[#ff6b4a]' },
            ].map(({ key, label, color }) => {
              const active = filtre === key
              return (
                <button 
                  key={key} 
                  onClick={() => setFiltre(key)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all border whitespace-nowrap ${
                    active
                      ? `${color} text-white border-transparent shadow-sm`
                      : 'bg-[#f9fafb] border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                  }`}
                >
                  {label}
                </button>
              )
            })}
          </div>

          {/* Alertes d'erreurs éventuelles */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Gestion des états de chargement / listes vides / cartes */}
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-3 border-gray-200 border-t-[#00b074] rounded-full animate-spin"></div>
            </div>
          ) : demandesFiltrees.length === 0 ? (
            <div className="py-16 text-center flex flex-col items-center justify-center gap-4 bg-[#f9fafb] rounded-2xl border border-dashed border-gray-200 max-w-xl mx-auto">
              <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100">
                <ClipboardList className="w-5 h-5" />
              </div>
              <div className="px-4">
                <p className="text-gray-900 font-bold text-sm">Aucun dossier trouvé</p>
                <p className="text-gray-400 text-xs mt-0.5">
                  Il n'y a aucune demande correspondant à cette catégorie pour le moment.
                </p>
              </div>
              {filtre === 'tous' && (
                <Link 
                  href="/demandes/new"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#00b074] text-white rounded-xl text-xs font-bold hover:bg-[#008f5d] transition-all"
                >
                  Créer un dossier
                </Link>
              )}
            </div>
          ) : (
            /* Grille responsive de cartes */
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {demandesFiltrees.map(d => (
                <div 
                  key={d.id} 
                  className="transition-transform duration-200 hover:-translate-y-0.5"
                >
                  <DemandeCard demande={d} onAnnuler={handleAnnuler} />
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}