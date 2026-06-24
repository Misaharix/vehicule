import { EtapeDemande, StatutDemande } from '@/types'

interface Props {
  etape: EtapeDemande
  statut: StatutDemande
}

const ETAPES = [
  { key: 'chef', label: 'Chef' },
  { key: 'logistique', label: 'Logistique' },
  { key: 'directeur', label: 'Directeur' },
  { key: 'termine', label: 'Terminé' },
]

export function DemandeProgression({ etape, statut }: Props) {
  const ordre = ETAPES.map(e => e.key)
  const etapeIndex = ordre.indexOf(etape)

  return (
    <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
      {ETAPES.map((e, i) => {
        const done = statut === 'approuvee' || i < etapeIndex
        const active = e.key === etape && statut === 'en_attente'
        const rejected = statut === 'rejetee' && e.key === etape

        return (
          <div key={e.key} className="flex items-center gap-1 sm:gap-2">
            <div className={`flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
              rejected ? 'bg-red-100 text-red-700'
              : done ? 'bg-[#1a5c38] text-white'
              : active ? 'bg-[#c8860a] text-white'
              : 'bg-gray-100 text-gray-500'
            }`}>
              {done && !active ? '✓' : rejected ? '✗' : i + 1}
              <span className="hidden sm:inline">{e.label}</span>
            </div>
            {i < ETAPES.length - 1 && (
              <div className={`h-px w-4 sm:w-6 ${done ? 'bg-[#1a5c38]' : 'bg-gray-200'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}