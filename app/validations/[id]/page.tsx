'use client'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useRole } from '@/hooks/useRole'
import { Navbar } from '@/components/Navbar'
import { Sidebar } from '@/components/Sidebar'
import { MissionsEnCours } from '@/components/MissionEnCours'
import { DemandeProgression } from '@/components/DemandeProgression'
import validationService from '@/services/validationService'
import vehiculeService from '@/services/vehiculeService'
import chauffeurService from '@/services/chauffeurService'
import { DemandeVehicule, Vehicule, Chauffeur } from '@/types'
import { 
  ArrowLeft, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  Info, 
  Car, 
  User, 
  MessageSquare,
  Sparkles
} from 'lucide-react'

export default function ValidationDetailPage() {
  const router = useRouter()
  const { id } = useParams()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { isLogistique } = useRole()
  const [demande, setDemande] = useState<DemandeVehicule | null>(null)
  const [vehicules, setVehicules] = useState<Vehicule[]>([])
  const [chauffeurs, setChauffeurs] = useState<Chauffeur[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    decision: 'approuve' as 'approuve' | 'rejete',
    commentaire: '',
    vehicule_id: null as number | null,
    chauffeur_id: null as number | null,
  })

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push('/login')
  }, [authLoading, isAuthenticated, router])

  useEffect(() => {
    if (isAuthenticated && id) loadData()
  }, [isAuthenticated, id])

  const loadData = async () => {
    try {
      setIsLoading(true)
      const demandes = await validationService.getDemandesAValider()
      const found = demandes.find((d: DemandeVehicule) => d.id === Number(id))
      if (!found) { setError('Demande introuvable ou déjà traitée'); return }
      setDemande(found)

      if (found.etape_validation === 'logistique') {
        const [v, c] = await Promise.all([
          vehiculeService.getVehiculesDisponibles(found.date_depart, found.date_retour),
          chauffeurService.getChauffeursDisponibles(),
        ])
        setVehicules(v)
        setChauffeurs(c)
      }
    } catch {
      setError('Erreur lors du chargement des informations de validation')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!demande) return
    if (demande.etape_validation === 'logistique' && form.decision === 'approuve') {
      if (!form.vehicule_id) { setError('Veuillez sélectionner un véhicule pour cette mission'); return }
      if (!form.chauffeur_id) { setError('Veuillez affecter un chauffeur pour cette mission'); return }
    }
    try {
      setIsSubmitting(true)
      setError('')
      await validationService.validerDemande(demande.id, form)
      router.push('/validations')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors de la validation du dossier')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (authLoading || isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-10 h-10 border-4 border-gray-100 border-t-[#00b074] rounded-full animate-spin"></div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-gray-800 font-sans">
      <Navbar />
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)] relative">
        <Sidebar />

        {/* Espace principal réactif */}
        <main className={`flex-1 bg-white m-4 lg:m-6 p-5 sm:p-6 lg:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6 transition-all ${
          isLogistique ? 'xl:mr-[340px]' : ''
        }`}>
          
          {/* Bouton Retour élégant */}
          <button 
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-gray-700 transition"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" /> Retour aux validations
          </button>

          {/* Alertes d'erreur */}
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-3 text-rose-600 text-xs font-semibold animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {demande && (
            <div className="max-w-3xl mx-auto space-y-6">
              
              {/* Carte Récapitative de la Demande */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-sm space-y-4">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider bg-gray-50 px-2 py-0.5 border border-gray-100 rounded">
                    Dossier n°{demande.id}
                  </span>
                  <h1 className="text-xl font-bold text-gray-900 tracking-tight mt-1">
                    {demande.destination}
                  </h1>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Émise par <span className="font-semibold text-gray-600">{demande.demandeur_nom}</span> — {demande.demandeur_poste}
                  </p>
                </div>

                <div className="py-2 border-t border-b border-gray-50">
                  <DemandeProgression etape={demande.etape_validation} statut={demande.statut} />
                </div>

                {/* Grille d'informations logistiques */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-[#f9fafb] p-4 rounded-xl border border-gray-50 text-xs">
                  {[
                    ['Motif de déplacement', demande.motif],
                    ['Nombre de passagers', `${demande.nombre_passagers} pers.`],
                    ['Date & Heure Départ', new Date(demande.date_depart).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })],
                    ['Date & Heure Retour', new Date(demande.date_retour).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })],
                  ].map(([label, value]) => (
                    <div key={label} className="space-y-0.5">
                      <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wide">{label}</p>
                      <p className="font-bold text-gray-800">{value}</p>
                    </div>
                  ))}
                </div>

                {demande.description && (
                  <div className="bg-emerald-50/10 border-l-2 border-emerald-500/30 p-3 rounded-r-xl text-xs text-gray-600 italic">
                    "{demande.description}"
                  </div>
                )}
              </div>

              {/* Formulaire de décision et d'affectation */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-sm space-y-5">
                <h2 className="text-sm font-bold text-gray-900 tracking-tight uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#00b074]" /> Traitement de la demande
                </h2>

                {/* Onglets de décision (Approuver / Rejeter) */}
                <div className="flex gap-3">
                  {(['approuve', 'rejete'] as const).map(d => {
                    const isSelected = form.decision === d
                    return (
                      <button 
                        key={d} 
                        type="button"
                        onClick={() => setForm(p => ({ ...p, decision: d }))}
                        className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border ${
                          isSelected
                            ? d === 'approuve' 
                              ? 'bg-emerald-50 text-[#00b074] border-[#00b074] shadow-sm' 
                              : 'bg-rose-50 text-rose-600 border-rose-200 shadow-sm'
                            : 'border-gray-100 text-gray-500 bg-white hover:bg-gray-50 hover:border-gray-200'
                        }`}
                      >
                        {d === 'approuve' ? (
                          <>
                            <CheckCircle2 className={`w-4 h-4 ${isSelected ? 'text-[#00b074]' : 'text-gray-400'}`} /> 
                            Approuver la demande
                          </>
                        ) : (
                          <>
                            <XCircle className={`w-4 h-4 ${isSelected ? 'text-rose-500' : 'text-gray-400'}`} /> 
                            Rejeter le dossier
                          </>
                        )}
                      </button>
                    )
                  })}
                </div>

                {/* Section Flotte & Ressources (Uniquement Profil Logistique + Si Décision Positive) */}
                {demande.etape_validation === 'logistique' && form.decision === 'approuve' && (
                  <div className="space-y-4 p-4 bg-slate-50 border border-slate-100 rounded-xl">
                    <div className="flex gap-2 text-xs text-slate-600 font-semibold mb-1">
                      <Info className="w-4 h-4 text-slate-400 shrink-0" />
                      <p>Affectation des ressources requises pour valider définitivement la mission.</p>
                    </div>

                    {/* Sélection du véhicule */}
                    <div className="space-y-1.5">
                      <label className="flex items-center justify-between text-xs font-bold text-gray-600">
                        <span className="flex items-center gap-1.5"><Car className="w-3.5 h-3.5 text-gray-400" /> Véhicule requis *</span>
                        <span className="px-1.5 py-0.5 text-[10px] bg-white border rounded text-gray-500 font-medium">
                          {vehicules.length} disponible(s)
                        </span>
                      </label>
                      {vehicules.length === 0 ? (
                        <div className="p-3 bg-rose-50/60 border border-rose-100 text-rose-600 text-xs font-medium rounded-lg">
                          Aucun véhicule disponible sur cette plage horaire.
                        </div>
                      ) : (
                        <select 
                          value={form.vehicule_id || ''}
                          onChange={e => setForm(p => ({ ...p, vehicule_id: Number(e.target.value) || null }))}
                          className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#00b074]/30 focus:border-[#00b074] transition"
                        >
                          <option value="">-- Sélectionner un véhicule de la flotte --</option>
                          {vehicules.map(v => (
                            <option key={v.id} value={v.id}>
                              {v.marque} {v.modele} ({v.immatriculation})
                            </option>
                          ))}
                        </select>
                      )}
                    </div>

                    {/* Sélection du chauffeur */}
                    <div className="space-y-1.5">
                      <label className="flex items-center justify-between text-xs font-bold text-gray-600">
                        <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-gray-400" /> Chauffeur assigné *</span>
                        <span className="px-1.5 py-0.5 text-[10px] bg-white border rounded text-gray-500 font-medium">
                          {chauffeurs.length} disponible(s)
                        </span>
                      </label>
                      {chauffeurs.length === 0 ? (
                        <div className="p-3 bg-rose-50/60 border border-rose-100 text-rose-600 text-xs font-medium rounded-lg">
                          Aucun chauffeur disponible pour cette date.
                        </div>
                      ) : (
                        <select 
                          value={form.chauffeur_id || ''}
                          onChange={e => setForm(p => ({ ...p, chauffeur_id: Number(e.target.value) || null }))}
                          className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#00b074]/30 focus:border-[#00b074] transition"
                        >
                          <option value="">-- Choisir un chauffeur disponible --</option>
                          {chauffeurs.map(c => (
                            <option key={c.id} value={c.id}>
                              {c.prenom} {c.nom} — {c.telephone}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>
                )}

                {/* Commentaire de décision */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-gray-400" /> Notes ou commentaires additionnels
                  </label>
                  <textarea 
                    value={form.commentaire}
                    onChange={e => setForm(p => ({ ...p, commentaire: e.target.value }))}
                    rows={3} 
                    placeholder="Précisez un motif ou une consigne particulière (optionnel)..."
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#00b074]/30 focus:border-[#00b074] transition resize-none" 
                  />
                </div>

                {/* Validation finale */}
                <button 
                  onClick={handleSubmit} 
                  disabled={isSubmitting}
                  className="w-full py-3 bg-[#00b074] text-white rounded-xl font-bold text-xs hover:bg-[#008f5d] transition-all shadow-md shadow-emerald-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Traitement de la décision...' : 'Confirmer et signer la décision'}
                </button>
              </div>
            </div>
          )}
        </main>

        {/* Panel missions en cours exclusif Logistique */}
        {isLogistique && (
          <aside className="w-full xl:w-[320px] xl:absolute xl:top-0 xl:right-0 p-4 lg:p-6 xl:h-full">
            <MissionsEnCours />
          </aside>
        )}
      </div>
    </div>
  )
}