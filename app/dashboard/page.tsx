'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Navbar } from '@/components/Navbar'
import { Sidebar } from '@/components/Sidebar'
import { DemandeCard } from '@/components/DemandeCard'
import demandeService from '@/services/demandeService'
import validationService from '@/services/validationService'
import { DemandeVehicule } from '@/types'
import Link from 'next/link'
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  Bell, 
  Plus, 
  ArrowRight,
  MapPin,
  GitBranch,
  Search,
  User,
  Eye
} from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const [mesDemandes, setMesDemandes] = useState<DemandeVehicule[]>([])
  const [aValider, setAValider] = useState<DemandeVehicule[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push('/login')
  }, [authLoading, isAuthenticated, router])

  useEffect(() => {
    if (isAuthenticated) loadData()
  }, [isAuthenticated])

  const loadData = async () => {
    try {
      setIsLoading(true)
      const [demandes, validations] = await Promise.all([
        demandeService.getMesDemandes(),
        validationService.getDemandesAValider(),
      ])
      setMesDemandes(demandes.slice(0, 3))
      setAValider(validations.slice(0, 3))
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  if (authLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-10 h-10 border-4 border-gray-100 border-t-[#00b074] rounded-full animate-spin"></div>
    </div>
  )

  const stats = [
    { 
      label: 'Mes demandes', 
      value: mesDemandes.length, 
      icon: FileText, 
      bgStyle: 'bg-gradient-to-br from-[#00b074] to-[#10b981] text-white shadow-lg shadow-emerald-500/10' 
    },
    { 
      label: 'En attente', 
      value: mesDemandes.filter(d => d.statut === 'en_attente').length, 
      icon: Clock, 
      bgStyle: 'bg-gradient-to-br from-[#18a0fb] to-[#0072f5] text-white shadow-lg shadow-blue-500/10' 
    },
    { 
      label: 'Approuvées', 
      value: mesDemandes.filter(d => d.statut === 'approuvee').length, 
      icon: CheckCircle2, 
      bgStyle: 'bg-gradient-to-br from-[#7b61ff] to-[#6366f1] text-white shadow-lg shadow-indigo-500/10' 
    },
    { 
      label: 'À valider', 
      value: aValider.length, 
      icon: Bell, 
      bgStyle: 'bg-gradient-to-br from-[#ff6b4a] to-[#f97316] text-white shadow-lg shadow-orange-500/10' 
    },
  ]

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-gray-800 font-sans selection:bg-[#00b074]/30">
      <Navbar />
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)]">
        <Sidebar />
        
        <main className="flex-1 bg-white m-4 lg:m-6 p-6 lg:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-8">
          
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                Good Morning, {user?.first_name || user?.username || 'Mahmud'}! 👋
              </h1>
              <p className="text-gray-400 text-xs mt-0.5 font-medium">
                {user?.poste || 'Logistique'} — <span className="text-[#00b074] font-bold">{user?.role || 'Manager'}</span>
              </p>
            </div>
            
            <div className="relative w-full sm:w-72">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </span>
              <input 
                type="text" 
                placeholder="Search courses or articles..." 
                className="w-full pl-10 pr-4 py-2.5 bg-[#f9fafb] border border-gray-200 rounded-full text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:border-gray-300 transition-all focus:ring-1 focus:ring-gray-200"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-3 border-gray-200 border-t-[#00b074] rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="space-y-8">
              
              {/* Grille des KPIs */}
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-4 gap-5">
                {stats.map(({ label, value, icon: Icon, bgStyle }) => (
                  <div 
                    key={label} 
                    className={`rounded-2xl p-5 flex flex-col justify-between h-32 transition-transform duration-200 hover:-translate-y-1 ${bgStyle}`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-0.5">
                        <p className="text-[11px] font-medium tracking-wide opacity-90">{label}</p>
                        <p className="text-3xl font-bold tracking-tight">{value}</p>
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-sm">
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div className="pt-2 border-t border-white/10 text-[10px] opacity-75 font-medium">
                      Mise à jour en temps réel
                    </div>
                  </div>
                ))}
              </div>

              {/* Disposition en 2 Blocs : Liste des demandes à gauche, Actions managériales à droite (ou inversement selon tes besoins) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                
                {/* BLOC DE GAUCHE : Mes dernières demandes (Prend 2 colonnes) */}
                <div className="lg:col-span-2 bg-[#f9fafb] rounded-2xl border border-gray-100 p-5">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h2 className="text-base font-bold text-gray-900 tracking-tight">Mes dernières demandes</h2>
                      <p className="text-[11px] text-gray-400 font-medium">Vos soumissions récentes de véhicules</p>
                    </div>
                    <Link href="/demandes" className="inline-flex items-center gap-1 text-xs font-bold text-[#00b074] hover:text-[#008f5d] transition-colors bg-white px-3 py-1.5 rounded-xl shadow-sm border border-gray-100">
                      Voir tout <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {mesDemandes.length === 0 ? (
                    <div className="py-12 text-center flex flex-col items-center justify-center gap-4 bg-white rounded-xl border border-dashed border-gray-200">
                      <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-gray-900 font-bold text-sm">Aucune demande enregistrée</p>
                      </div>
                      <Link href="/demandes/new" className="inline-flex items-center gap-2 px-4 py-2 bg-[#00b074] text-white rounded-xl text-xs font-bold hover:bg-[#008f5d] transition-all">
                        <Plus className="w-4 h-4" /> Créer une demande
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {mesDemandes.map(d => <DemandeCard key={d.id} demande={d} />)}
                    </div>
                  )}
                </div>

                {/* BLOC DE DROITE AMÉLIORÉ : Demandes à valider (Style Liste de Cours Epurée de dashboard.jpg) */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h2 className="text-base font-bold text-gray-900 tracking-tight">À approuver</h2>
                      <p className="text-[11px] text-gray-400 font-medium">Actions requises</p>
                    </div>
                    {aValider.length > 0 && (
                      <Link href="/validations" className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700 bg-orange-50 px-2.5 py-1 rounded-lg transition-colors">
                        Tout traiter
                      </Link>
                    )}
                  </div>

                  {aValider.length === 0 ? (
                    <div className="py-8 text-center text-gray-400 text-xs bg-[#f9fafb] rounded-xl border border-dashed border-gray-200">
                      Aucun dossier en attente d'approbation.
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {aValider.map(d => (
                        <div key={d.id} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4 group">
                          
                          {/* Infos principales du demandeur */}
                          <div className="flex items-start gap-3 min-w-0">
                            <div className="w-9 h-9 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center flex-shrink-0 text-orange-500">
                              <User className="w-4 h-4" />
                            </div>
                            <div className="min-w-0 space-y-0.5">
                              <p className="font-bold text-gray-900 text-xs truncate">{d.demandeur_nom}</p>
                              <div className="flex items-center gap-2 text-[10px] text-gray-400 font-medium">
                                <span className="flex items-center gap-0.5 truncate">
                                  <MapPin className="w-3 h-3 text-gray-300 flex-shrink-0" /> {d.destination}
                                </span>
                                <span className="text-gray-200">•</span>
                                <span className="text-orange-600 font-semibold bg-orange-50 px-1 rounded truncate">
                                  {d.etape_display || 'Validation'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Petit bouton d'action circulaire/arrondi style "dashboard.jpg" */}
                          <Link 
                            href={`/validations/${d.id}`} 
                            title="Analyser & Décider"
                            className="w-8 h-8 rounded-full bg-[#f9fafb] border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-[#ff6b4a] hover:text-white hover:border-[#ff6b4a] transition-all flex-shrink-0 shadow-sm"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>

                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

            </div>
          )}
        </main>
      </div>
    </div>
  )
}