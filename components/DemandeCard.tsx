'use client'
import { DemandeVehicule } from '@/types'
import { DemandeProgression } from './DemandeProgression'
import Link from 'next/link'
import { Calendar, Users, MapPin, Eye, XCircle } from 'lucide-react'

interface Props {
  demande: DemandeVehicule
  onAnnuler?: (id: number) => void
}

const MOTIF_LABELS: Record<string, string> = {
  mission: 'Mission terrain',
  transport: 'Transport matériel',
  deplacement: 'Déplacement officiel',
  autre: 'Autre motif',
}

export function DemandeCard({ demande, onAnnuler }: Props) {
  // Couleurs de badges harmonisées avec dashboard.jpg
  const statutColor = {
    en_attente: 'bg-amber-50 text-amber-600 border-amber-100',
    approuvee: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    rejetee: 'bg-rose-50 text-rose-600 border-rose-100',
  }[demande.statut] || 'bg-gray-50 text-gray-600 border-gray-100'

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 shadow-sm hover:shadow-md hover:border-gray-200/80 transition-all duration-200 flex flex-col justify-between h-full group">
      <div>
        {/* En-tête de la carte */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-gray-900">
              <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 group-hover:text-[#00b074] transition-colors" />
              <h3 className="font-bold text-sm sm:text-base truncate tracking-tight">
                {demande.destination}
              </h3>
            </div>
            <p className="text-[11px] text-gray-400 font-semibold mt-0.5 ml-5">
              {MOTIF_LABELS[demande.motif] || demande.motif}
            </p>
          </div>
          
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide border whitespace-nowrap uppercase ${statutColor}`}>
            {demande.statut_display}
          </span>
        </div>

        {/* Détails logistiques grisés */}
        <div className="bg-[#f9fafb] rounded-xl p-3 text-[11px] text-gray-500 space-y-2 mb-4 border border-gray-50">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5 text-gray-400" /> Départ
            </span>
            <span className="font-bold text-gray-700">
              {new Date(demande.date_depart).toLocaleDateString('fr-FR')}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5 text-gray-400" /> Retour
            </span>
            <span className="font-bold text-gray-700">
              {new Date(demande.date_retour).toLocaleDateString('fr-FR')}
            </span>
          </div>
          <div className="flex items-center justify-between pt-1.5 border-t border-gray-200/60">
            <span className="flex items-center gap-1.5 font-medium">
              <Users className="w-3.5 h-3.5 text-gray-400" /> Logistique
            </span>
            <span className="font-bold text-gray-800 bg-gray-200/60 px-1.5 py-0.5 rounded">
              {demande.nombre_passagers} passager(s)
            </span>
          </div>
        </div>
      </div>

      {/* Barre de progression & Boutons d'action */}
      <div className="space-y-4">
        <div className="px-1">
          <DemandeProgression etape={demande.etape_validation} statut={demande.statut} />
        </div>

        <div className="flex sm:flex-row gap-2 pt-2 border-t border-gray-100">
          <Link 
            href={`/demandes/${demande.id}`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-[#00b074] border border-emerald-100 bg-emerald-50/20 rounded-xl hover:bg-[#00b074] hover:text-white hover:border-transparent transition-all shadow-sm"
          >
            <Eye className="w-3.5 h-3.5" /> Voir détail
          </Link>
          
          {demande.statut === 'en_attente' && onAnnuler && (
            <button 
              onClick={() => onAnnuler(demande.id)}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-rose-600 border border-rose-100 bg-rose-50/10 rounded-xl hover:bg-rose-50 hover:border-rose-200 transition-all"
            >
              <XCircle className="w-3.5 h-3.5" /> Annuler
            </button>
          )}
        </div>
      </div>
    </div>
  )
}