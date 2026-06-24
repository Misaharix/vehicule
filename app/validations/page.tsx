'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Navbar } from '@/components/Navbar'
import { Sidebar } from '@/components/Sidebar'
import { MissionsEnCours } from '@/components/MissionEnCours'
import validationService from '@/services/validationService'
import { DemandeVehicule } from '@/types'
import Link from 'next/link'
import { 
  CheckSquare, 
  MapPin, 
  Calendar, 
  Users, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react'

export default function ValidationsPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading, userRole } = useAuth()
  const [demandes, setDemandes] = useState<DemandeVehicule[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const isLogistique = userRole === 'Logistique'

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push('/login')
  }, [authLoading, isAuthenticated, router])

  useEffect(() => {
    if (isAuthenticated) loadDemandes()
  }, [isAuthenticated])

  const loadDemandes = async () => {
    try {
      setIsLoading(true)
      const data = await validationService.getDemandesAValider()
      setDemandes(data)
    } catch {
      setError('Erreur lors du chargement des dossiers en attente')
    } finally {
      setIsLoading(false)
    }
  }

  if (authLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-10 h-10 border-4 border-gray-100 border-t-[#00b074] rounded-full animate-spin"></div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-gray-800 font-sans">
      <Navbar />
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)] relative">
        <Sidebar />

        {/* Espace de contenu principal - s'adapte élégamment si la sidebar logistique est présente */}
        <main className={`flex-1 bg-white m-4 lg:m-6 p-5 sm:p-6 lg:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6 transition-all ${
          isLogistique ? 'xl:mr-[340px]' : ''
        }`}>
          
          {/* En-tête de section */}
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              Demandes à valider
            </h1>
            <p className="text-gray-400 text-xs mt-0.5 font-medium">
              {demandes.length} dossier(s) en attente de votre décision
            </p>
          </div>

          {/* Message d'erreur */}
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-3 text-rose-600 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* États de chargement et listes de dossiers */}
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-3 border-gray-200 border-t-[#00b074] rounded-full animate-spin"></div>
            </div>
          ) : demandes.length === 0 ? (
            <div className="py-16 text-center flex flex-col items-center justify-center gap-4 bg-[#f9fafb] rounded-2xl border border-dashed border-gray-200 max-w-xl mx-auto">
              <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#00b074]">
                <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="px-4">
                <p className="text-gray-900 font-bold text-sm">Tout est à jour !</p>
                <p className="text-gray-400 text-xs mt-0.5">
                  Aucune demande de véhicule n'est en attente de votre approbation pour le moment.
                </p>
              </div>
            </div>
          ) : (
            /* Liste des demandes empilées */
            <div className="space-y-4">
              {demandes.map(d => (
                <div 
                  key={d.id} 
                  className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 shadow-sm hover:shadow-md hover:border-gray-200/80 transition-all duration-200 group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    
                    {/* Informations du demandeur & de la mission */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h3 className="font-bold text-sm sm:text-base text-gray-900 tracking-tight">
                          {d.demandeur_nom}
                        </h3>
                        <span className="px-2.5 py-0.5 bg-amber-50 border border-amber-100 text-amber-600 rounded-full text-[10px] font-bold tracking-wide uppercase">
                          {d.etape_display}
                        </span>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-gray-400">{d.demandeur_poste}</p>
                        <div className="flex items-center gap-1.5 text-gray-800 pt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#00b074] transition-colors shrink-0" />
                          <p className="font-bold text-xs sm:text-sm truncate">{d.destination}</p>
                        </div>
                      </div>

                      {/* Meta-données logistiques */}
                      <div className="flex flex-wrap gap-x-4 gap-y-1.5 pt-1 text-[11px] text-gray-400 font-medium">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-gray-300" /> 
                          {new Date(d.date_depart).toLocaleDateString('fr-FR')} au {new Date(d.date_retour).toLocaleDateString('fr-FR')}
                        </span>
                        <span className="flex items-center gap-1 font-semibold text-gray-500">
                          <Users className="w-3.5 h-3.5 text-gray-300" /> 
                          {d.nombre_passagers} passager(s)
                        </span>
                      </div>
                    </div>

                    {/* Action de traitement */}
                    <div className="pt-2 sm:pt-0 shrink-0">
                      <Link
                        href={`/validations/${d.id}`}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#00b074] text-white rounded-xl text-xs font-bold hover:bg-[#008f5d] transition-all shadow-md shadow-emerald-500/5 whitespace-nowrap"
                      >
                        Traiter le dossier <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                      </Link>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        {/* Affichage conditionnel de la colonne latérale droite (Missions en cours) */}
        {isLogistique && (
          <aside className="w-full xl:w-[320px] xl:absolute xl:top-0 xl:right-0 p-4 lg:p-6 xl:h-full">
            <MissionsEnCours />
          </aside>
        )}
      </div>
    </div>
  )
}