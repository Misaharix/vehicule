'use client'
import { useEffect, useState, useRef } from 'react'
import { usePathname } from 'next/navigation'
import vehiculeService from '@/services/vehiculeService'
// Installation requise : npm install lucide-react
import { 
  MapPin, 
  User, 
  Car, 
  UserCheck, 
  Calendar, 
  Activity, 
  Flag,
  Radio,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

interface Mission {
  id: number
  destination: string
  demandeur_nom: string
  date_depart: string
  date_retour: string
  vehicule: string
  chauffeur: string
}

export function MissionsEnCours() {
  const [missions, setMissions] = useState<Mission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isOpenMobile, setIsOpenMobile] = useState(false) // Gère l'ouverture du tiroir sur mobile
  const scrollRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  // Fermer le tiroir automatiquement si l'utilisateur change de page
  useEffect(() => {
    setIsOpenMobile(false)
  }, [pathname])

  useEffect(() => {
    loadMissions()
    const interval = setInterval(loadMissions, 30000) // Rafraîchir toutes les 30s
    return () => clearInterval(interval)
  }, [])

  // Auto-scroll doux
  useEffect(() => {
    const el = scrollRef.current
    if (!el || missions.length === 0) return

    let scrollPos = 0
    const scroll = setInterval(() => {
      scrollPos += 0.5
      if (scrollPos >= el.scrollHeight - el.clientHeight) scrollPos = 0
      el.scrollTop = scrollPos
    }, 30)

    return () => clearInterval(scroll)
  }, [missions])

  const loadMissions = async () => {
    try {
      const data = await vehiculeService.getMissionsEnCours()
      setMissions(data)
    } catch { 
      // Gestion silencieuse des erreurs
    } finally { 
      setIsLoading(false) 
    }
  }

  return (
    <>
      {/* BOUTON FLOTTANT MOBILE : Visible uniquement sur mobiles/tablettes (< lg) */}
      <button
        onClick={() => setIsOpenMobile(!isOpenMobile)}
        className="lg:hidden fixed right-4 bottom-24 z-50 p-3.5 bg-gray-900 text-white rounded-full shadow-2xl hover:bg-gray-800 active:scale-95 transition-all flex items-center justify-center border border-white/10"
        aria-label="Missions actives"
      >
        {isOpenMobile ? <ChevronRight className="w-5 h-5" /> : <Activity className="w-5 h-5 text-green-400 animate-pulse" />}
        {missions.length > 0 && !isOpenMobile && (
          <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center animate-bounce">
            {missions.length}
          </span>
        )}
      </button>

      {/* PANNEAU LATÉRAL : S'adapte en tiroir sur mobile et en colonne fixe sur Desktop */}
      <div className={`
        w-80 bg-white border-l border-gray-100 flex flex-col h-[calc(100vh-64px)] fixed right-0 top-16 bottom-0 z-40 shadow-xl lg:shadow-none
        transform transition-transform duration-300 ease-in-out lg:translate-x-0
        ${isOpenMobile ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}>
        {/* Header style Oovoom Live */}
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <h3 className="text-gray-900 font-extrabold text-xs tracking-wider uppercase flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1a5c38] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#1a5c38]"></span>
            </span>
            Suivi des Missions ({missions.length})
          </h3>
          <span className="text-[10px] bg-green-50 text-[#1a5c38] font-bold px-2 py-0.5 rounded border border-green-100 uppercase tracking-tight flex items-center gap-1">
            <Radio className="w-3 h-3 text-[#1a5c38] animate-pulse" /> Live
          </span>
        </div>

        {/* Liste défilante à défilement doux */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-none">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <div className="w-6 h-6 border-2 border-gray-200 border-t-[#1a5c38] rounded-full animate-spin"></div>
              <p className="text-gray-400 text-[11px] font-medium">Synchronisation...</p>
            </div>
          ) : missions.length === 0 ? (
            <div className="text-center py-12 bg-gray-50/50 rounded-2xl border border-gray-100/70 p-4 shadow-inner flex flex-col items-center justify-center gap-2">
              <Flag className="w-8 h-8 text-gray-300" />
              <div>
                <p className="text-gray-800 font-bold text-xs">Aucune activité</p>
                <p className="text-gray-400 text-[10px] mt-0.5">Tous les véhicules sont actuellement au dépôt.</p>
              </div>
            </div>
          ) : (
            missions.map(m => (
              <div key={m.id} className="bg-white border border-gray-100 hover:border-gray-200/80 rounded-2xl p-4 space-y-2.5 shadow-sm transition-all group relative overflow-hidden">
                {/* Ligne d'accentuation sur le côté */}
                <div className="absolute top-0 bottom-0 left-0 w-1 bg-[#1a5c38]/40 group-hover:bg-[#1a5c38] transition-colors" />

                {/* Destination */}
                <div className="flex items-start gap-2.5 pl-1.5">
                  <MapPin className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                  <p className="font-extrabold text-gray-900 text-xs leading-snug group-hover:text-[#1a5c38] transition-colors">{m.destination}</p>
                </div>

                {/* Détails logistiques */}
                <div className="space-y-1.5 pl-1.5 pt-1">
                  <div className="flex items-center gap-2.5 text-[11px] text-gray-500 font-medium">
                    <User className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                    <span className="truncate text-gray-700">{m.demandeur_nom}</span>
                  </div>

                  <div className="flex items-center gap-2.5 text-[11px] text-gray-500 font-medium">
                    <Car className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                    <span className="truncate font-mono font-semibold bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100 text-gray-600">{m.vehicule}</span>
                  </div>

                  <div className="flex items-center gap-2.5 text-[11px] text-gray-500 font-medium">
                    <UserCheck className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                    <span className="truncate text-gray-700">{m.chauffeur}</span>
                  </div>
                </div>

                {/* Section Dates */}
                <div className="pt-2.5 border-t border-gray-50 flex items-center justify-between text-[10px] font-bold text-gray-400 font-mono pl-1.5">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 stroke-[2.5]" />
                    {new Date(m.date_depart).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
                  </span>
                  <span>➔</span>
                  <span>
                    {new Date(m.date_retour).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info actualisation */}
        <div className="p-3 border-t border-gray-50 bg-gray-50/70">
          <p className="text-[10px] font-medium text-gray-400 text-center uppercase tracking-wider">Mise à jour automatique (30s)</p>
        </div>
      </div>

      {/* Rideau de flou d'arrière-plan (Overlay) : Uniquement sur mobile si le panneau est ouvert */}
      {isOpenMobile && (
        <div
          className="fixed lg:hidden inset-0 bg-gray-900/20 backdrop-blur-sm z-30 transition-opacity"
          onClick={() => setIsOpenMobile(false)}
        />
      )}
    </>
  )
}