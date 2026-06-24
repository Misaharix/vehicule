'use client'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Navbar } from '@/components/Navbar'
import { Sidebar } from '@/components/Sidebar'
import { DemandeProgression } from '@/components/DemandeProgression'
import demandeService from '@/services/demandeService'
import { DemandeVehicule } from '@/types'
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Users, 
  User, 
  Briefcase, 
  FileText, 
  Car, 
  CheckCircle2, 
  XCircle,
  AlertCircle
} from 'lucide-react'

export default function DetailDemandePage() {
  const router = useRouter()
  const { id } = useParams()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const [demande, setDemande] = useState<DemandeVehicule | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push('/login')
  }, [authLoading, isAuthenticated, router])

  useEffect(() => {
    if (isAuthenticated && id) loadDemande()
  }, [isAuthenticated, id])

  const loadDemande = async () => {
    try {
      setIsLoading(true)
      const data = await demandeService.getDemandeById(Number(id))
      setDemande(data)
    } catch {
      setError('Demande introuvable ou accès non autorisé')
    } finally {
      setIsLoading(false)
    }
  }

  const MOTIF_LABELS: Record<string, string> = {
    mission: 'Mission terrain',
    transport: 'Transport matériel',
    deplacement: 'Déplacement officiel',
    autre: 'Autre motif',
  }

  if (authLoading || isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-10 h-10 border-4 border-gray-100 border-t-[#00b074] rounded-full animate-spin"></div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-gray-800 font-sans">
      <Navbar />
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)]">
        <Sidebar />
        
        {/* Conteneur principal calqué sur le panneau de droite de dashboard.jpg */}
        <main className="flex-1 bg-white m-4 lg:m-6 p-5 sm:p-6 lg:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
          
          {/* Bouton Retour épuré */}
          <button 
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-gray-700 bg-[#f9fafb] border border-gray-200 px-3 py-1.5 rounded-full transition-all shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Retour
          </button>

          {error ? (
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-xs font-semibold max-w-xl mx-auto">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          ) : demande && (
            <div className="max-w-3xl mx-auto space-y-6">
              
              {/* SECTION EN-TÊTE PRINCIPALE */}
              <div className="bg-[#f9fafb] rounded-2xl border border-gray-100 p-5 sm:p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#18a0fb] to-[#0072f5] flex items-center justify-center text-white shadow-md shadow-blue-500/10 flex-shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h1 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">{demande.destination}</h1>
                      <p className="text-gray-400 text-xs mt-0.5 font-semibold bg-gray-200/50 inline-block px-2 py-0.5 rounded-md">
                        {MOTIF_LABELS[demande.motif] || demande.motif}
                      </p>
                    </div>
                  </div>
                  
                  {/* Badge de Statut Dynamique */}
                  <div className="sm:text-right">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wide border ${
                      demande.statut === 'approuvee' ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                      : demande.statut === 'rejetee' ? 'bg-rose-50 text-rose-600 border-rose-100'
                      : 'bg-amber-50 text-amber-600 border-amber-100'
                    }`}>
                      {demande.statut_display}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-200/60">
                  <DemandeProgression etape={demande.etape_validation} statut={demande.statut} />
                </div>
              </div>

              {/* GRILLE À DEUX COLONNES : Infos demande VS Affectations */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-start">
                
                {/* BLOC : DÉTAILS DE LA DEMANDE (Prend 3 colonnes) */}
                <div className="md:col-span-3 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" /> Détails du dossier
                  </h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div className="space-y-3">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400 flex items-center gap-1"><User className="w-3 h-3"/> Demandeur</p>
                        <p className="font-bold text-gray-800 text-xs mt-0.5">{demande.demandeur_nom}</p>
                        <p className="text-[11px] text-gray-400 font-medium">{demande.demandeur_poste}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400 flex items-center gap-1"><Briefcase className="w-3 h-3"/> Chef direct</p>
                        <p className="font-semibold text-gray-800 text-xs mt-0.5">{demande.chef_direct_nom || 'Non requis'}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400 flex items-center gap-1"><Calendar className="w-3 h-3"/> Planning Mission</p>
                        <div className="text-xs font-medium text-gray-700 space-y-1 mt-1">
                          <p><span className="text-gray-400 font-semibold">Départ :</span> {new Date(demande.date_depart).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}</p>
                          <p><span className="text-gray-400 font-semibold">Retour :</span> {new Date(demande.date_retour).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400 flex items-center gap-1"><Users className="w-3 h-3"/> Logistique</p>
                        <p className="font-bold text-gray-800 text-xs mt-0.5">{demande.nombre_passagers} passager(s)</p>
                      </div>
                    </div>
                  </div>

                  {demande.description && (
                    <div className="mt-2 pt-3.5 border-t border-gray-100">
                      <p className="text-[10px] uppercase font-bold text-gray-400">Description / Objectifs</p>
                      <p className="text-gray-600 text-xs mt-1 leading-relaxed whitespace-pre-line bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                        {demande.description}
                      </p>
                    </div>
                  )}
                </div>

                {/* BLOC : VÉHICULE & CHAUFFEUR (Prend 2 colonnes) */}
                <div className="md:col-span-2 space-y-4">
                  {(demande.vehicule_info || demande.chauffeur_info) ? (
                    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">
                      <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                        <Car className="w-3.5 h-3.5" /> Moyens affectés
                      </h2>
                      
                      <div className="space-y-4 pt-1">
                        {demande.vehicule_info && (
                          <div className="flex gap-3 items-start bg-emerald-50/40 p-3 rounded-xl border border-emerald-100/40">
                            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
                              <Car className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-[10px] uppercase font-bold text-emerald-700/70">Véhicule</p>
                              <p className="font-bold text-gray-800 text-xs truncate mt-0.5">
                                {demande.vehicule_info.marque} {demande.vehicule_info.modele}
                              </p>
                              <p className="text-[11px] text-gray-500 font-mono font-semibold tracking-wider">{demande.vehicule_info.immatriculation}</p>
                            </div>
                          </div>
                        )}

                        {demande.chauffeur_info && (
                          <div className="flex gap-3 items-start bg-indigo-50/40 p-3 rounded-xl border border-indigo-100/40">
                            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0">
                              <User className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-[10px] uppercase font-bold text-indigo-700/70">Chauffeur</p>
                              <p className="font-bold text-gray-800 text-xs truncate mt-0.5">
                                {demande.chauffeur_info.prenom} {demande.chauffeur_info.nom}
                              </p>
                              <p className="text-[11px] text-gray-500 font-medium">{demande.chauffeur_info.telephone}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-5 text-center text-xs text-gray-400 font-medium">
                      Aucune ressource (véhicule/chauffeur) n'a encore été affectée à cette étape.
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION : HISTORIQUE DES VALIDATIONS */}
              {demande.validations && demande.validations.length > 0 && (
                <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Parcours d'approbation
                  </h2>
                  
                  <div className="space-y-3">
                    {demande.validations.map((v) => {
                      const isApproved = v.decision === 'approuve';
                      return (
                        <div 
                          key={v.id} 
                          className={`flex items-start gap-3.5 p-3.5 rounded-xl border transition-colors ${
                            isApproved 
                              ? 'bg-emerald-50/30 border-emerald-100/60' 
                              : 'bg-rose-50/30 border-rose-100/60'
                          }`}
                        >
                          <div className="flex-shrink-0 mt-0.5">
                            {isApproved ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 stroke-[2.5]" />
                            ) : (
                              <XCircle className="w-4 h-4 text-rose-500 stroke-[2.5]" />
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-4">
                              <p className="text-xs font-bold text-gray-900">{v.etape_display}</p>
                              <span className="text-[10px] text-gray-400 font-semibold">
                                {new Date(v.date_validation).toLocaleDateString('fr-FR')}
                              </span>
                            </div>
                            <p className="text-[11px] text-gray-400 font-medium mt-0.5">Validé par : <span className="text-gray-600 font-semibold">{v.validateur_nom}</span></p>
                            
                            {v.commentaire && (
                              <div className="mt-2 text-xs text-gray-500 bg-white/70 border border-gray-100 p-2 rounded-lg italic">
                                "{v.commentaire}"
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          )}
        </main>
      </div>
    </div>
  )
}