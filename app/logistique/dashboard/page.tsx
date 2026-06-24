'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Navbar } from '@/components/Navbar'
import { Sidebar } from '@/components/Sidebar'
import { MissionsEnCours } from '@/components/MissionEnCours'
import validationService from '@/services/validationService'
import vehiculeService from '@/services/vehiculeService'
import chauffeurService from '@/services/chauffeurService'
import Link from 'next/link'
// Installation requise : npm install lucide-react
import { 
  Clock, 
  Car, 
  CheckCircle2, 
  Users, 
  ClipboardCheck, 
  UserCheck, 
  ChevronRight,
  AlertCircle
} from 'lucide-react'

interface Stats {
  demandesEnAttente: number
  missionsEnCours: number
  vehiculesDisponibles: number
  chauffeursDisponibles: number
}

export default function DashboardLogistiquePage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading, user } = useAuth()
  const [stats, setStats] = useState<Stats>({
    demandesEnAttente: 0,
    missionsEnCours: 0,
    vehiculesDisponibles: 0,
    chauffeursDisponibles: 0,
  })
  const [demandesRecentes, setDemandesRecentes] = useState<any[]>([])
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
      const [demandes, vehicules, chauffeurs, missions] = await Promise.allSettled([
        validationService.getDemandesAValider(),
        vehiculeService.getAll(),
        chauffeurService.getAll(),
        vehiculeService.getMissionsEnCours(),
      ])

      const demandesData  = demandes.status  === 'fulfilled' ? demandes.value  : []
      const vehiculesData = vehicules.status === 'fulfilled' ? vehicules.value : []
      const chauffeursData= chauffeurs.status=== 'fulfilled' ? chauffeurs.value: []
      const missionsData  = missions.status  === 'fulfilled' ? missions.value  : []

      const vehiculesList  = Array.isArray(vehiculesData)  ? vehiculesData  : (vehiculesData as any).results  ?? []
      const chauffeursList = Array.isArray(chauffeursData) ? chauffeursData : (chauffeursData as any).results ?? []

      setStats({
        demandesEnAttente:    demandesData.length,
        missionsEnCours:      missionsData.length,
        vehiculesDisponibles: vehiculesList.filter((v: any) => v.disponible).length,
        chauffeursDisponibles:chauffeursList.filter((c: any) => c.disponible).length,
      })
      setDemandesRecentes(demandesData.slice(0, 5))
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  if (authLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-[#1a5c38] rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium">Chargement de votre session...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6 lg:p-10 mr-80">

          {/* Header style Oovoom */}
          <div className="mb-10">
            <span className="text-[10px] uppercase tracking-[2px] font-bold text-gray-400">Tableau de bord</span>
            <h1 className="text-3xl font-extrabold text-gray-900 mt-1">
              Général <span className="text-[#1a5c38]">Logistique</span>
            </h1>
            <p className="text-gray-500 text-sm mt-2">
              Ravi de vous revoir, <span className="font-semibold text-gray-700">{user?.first_name || user?.username}</span>. Voici l'état actuel de votre flotte.
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
               <div className="w-10 h-10 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {/* Grille de Cartes KPI - Style Image Référence */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard
                  icon={<Clock className="w-6 h-6 text-orange-500" />}
                  label="DEMANDES EN ATTENTE"
                  value={stats.demandesEnAttente}
                  accentColor="bg-orange-500"
                  textColor="text-orange-600"
                  href="/validations"
                />
                <StatCard
                  icon={<Car className="w-6 h-6 text-[#1a5c38]" />}
                  label="MISSIONS EN COURS"
                  value={stats.missionsEnCours}
                  accentColor="bg-[#1a5c38]"
                  textColor="text-[#1a5c38]"
                />
                <StatCard
                  icon={<CheckCircle2 className="w-6 h-6 text-green-500" />}
                  label="VÉHICULES DISPOS"
                  value={stats.vehiculesDisponibles}
                  accentColor="bg-green-500"
                  textColor="text-green-600"
                  href="/vehicules"
                />
                <StatCard
                  icon={<Users className="w-6 h-6 text-blue-500" />}
                  label="CHAUFFEURS DISPOS"
                  value={stats.chauffeursDisponibles}
                  accentColor="bg-blue-500"
                  textColor="text-blue-600"
                  href="/chauffeurs"
                />
              </div>

              {/* Actions rapides - Design Moderne */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                <QuickAction
                  href="/validations"
                  icon={<ClipboardCheck className="w-6 h-6" />}
                  label="Valider les demandes"
                  desc="Affecter véhicule & chauffeur"
                  badge={stats.demandesEnAttente}
                  color="bg-[#1a5c38]"
                />
                <QuickAction
                  href="/vehicules"
                  icon={<Car className="w-6 h-6" />}
                  label="Gérer les véhicules"
                  desc="Disponibilité de la flotte"
                  color="bg-gray-800"
                />
                <QuickAction
                  href="/chauffeurs"
                  icon={<UserCheck className="w-6 h-6" />}
                  label="Gérer les chauffeurs"
                  desc="Suivi des affectations"
                  color="bg-orange-600"
                />
              </div>

              {/* Liste des demandes récentes */}
              {demandesRecentes.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                    <h2 className="font-bold text-gray-800 flex items-center gap-2">
                       <AlertCircle className="w-5 h-5 text-orange-500" />
                       Demandes à traiter en priorité
                    </h2>
                    <Link href="/validations" className="text-[#1a5c38] text-sm font-bold hover:underline flex items-center gap-1">
                      VOIR TOUT <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {demandesRecentes.map(d => (
                      <div key={d.id} className="p-5 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-xs">
                             {d.demandeur_nom?.substring(0,2).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-gray-900 text-sm truncate">{d.demandeur_nom}</p>
                            <p className="text-gray-500 text-xs truncate flex items-center gap-1">
                               📍 {d.destination}
                            </p>
                          </div>
                        </div>
                        
                        <div className="hidden md:block text-right">
                           <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Date de départ</p>
                           <p className="text-gray-700 text-xs font-semibold">
                              {new Date(d.date_depart).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                           </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-[10px] font-bold border border-orange-100 uppercase tracking-tighter">
                            {d.etape_display || 'En attente'}
                          </span>
                          <Link
                            href={`/validations/${d.id}`}
                            className="p-2 bg-gray-50 text-gray-400 rounded-xl hover:bg-[#1a5c38] hover:text-white transition-all group"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </main>

        <MissionsEnCours />
      </div>
    </div>
  )
}

/**
 * Composant Carte Statistique (Style Oovoom Fleet)
 */
/**
 * Composant Carte Statistique - Amélioré avec des fonds de couleur subtils
 */
function StatCard({
  icon, label, value, accentColor, bgGradient, borderColor, textColor, href,
}: {
  icon: React.ReactNode
  label: string
  value: number
  accentColor: string
  bgGradient: string
  borderColor: string
  textColor: string
  href?: string
}) {
  const content = (
    <div className={`bg-white rounded-2xl p-6 border ${borderColor} shadow-sm flex flex-col gap-4 h-full hover:shadow-md transition-all relative overflow-hidden group`}>
      
      {/* Arrière-plan coloré discret en dégradé */}
      <div className={`absolute inset-0 opacity-40 bg-gradient-to-br ${bgGradient} pointer-events-none`} />
      
      {/* Contenu de la carte (au-dessus du fond) */}
      <div className="relative z-10 flex flex-col gap-4">
        <div className="p-2 w-fit rounded-xl bg-white shadow-sm border border-gray-100 group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">{label}</p>
          <div className="flex items-center gap-3">
            {/* Barre verticale accentuée */}
            <div className={`w-1.5 h-8 ${accentColor} rounded-full shadow-sm`}></div>
            <p className={`text-3xl font-black ${textColor}`}>{value}</p>
          </div>
        </div>
      </div>
    </div>
  )

  return href ? <Link href={href} className="block">{content}</Link> : content
}

/**
 * Composant Action Rapide
 */
function QuickAction({ href, icon, label, desc, badge, color }: any) {
  return (
    <Link
      href={href}
      className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-all group flex flex-col gap-4 relative overflow-hidden"
    >
      <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center text-white shadow-lg shadow-gray-200 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      {badge !== null && badge > 0 && (
        <span className="absolute top-6 right-6 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-lg">
          {badge}
        </span>
      )}
      <div>
        <p className="font-bold text-gray-900 text-sm group-hover:text-[#1a5c38] transition-colors">{label}</p>
        <p className="text-xs text-gray-400 mt-1">{desc}</p>
      </div>
    </Link>
  )
}