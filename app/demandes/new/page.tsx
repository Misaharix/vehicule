'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Navbar } from '@/components/Navbar'
import { Sidebar } from '@/components/Sidebar'
import demandeService from '@/services/demandeService'
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Users, 
  FileText, 
  Compass, 
  AlertCircle 
} from 'lucide-react'

const MOTIFS = [
  { value: 'mission', label: 'Mission terrain' },
  { value: 'transport', label: 'Transport de matériel' },
  { value: 'deplacement', label: 'Déplacement officiel' },
  { value: 'autre', label: 'Autre' },
]

export default function NouvelleDemandePage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const [form, setForm] = useState({
    motif: 'mission',
    destination: '',
    description: '',
    date_depart: '',
    date_retour: '',
    nombre_passagers: 1,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push('/login')
  }, [authLoading, isAuthenticated, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.destination || !form.date_depart || !form.date_retour) {
      setError('Veuillez remplir tous les champs obligatoires')
      return
    }
    if (new Date(form.date_retour) <= new Date(form.date_depart)) {
      setError('La date de retour doit être postérieure à la date de départ')
      return
    }
    try {
      setIsLoading(true)
      await demandeService.creerDemande(form)
      router.push('/demandes')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Une erreur est survenue lors de la création de la demande')
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
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)]">
        <Sidebar />
        
        {/* Conteneur principal calqué sur le grand panneau blanc de dashboard.jpg */}
        <main className="flex-1 bg-white m-4 lg:m-6 p-5 sm:p-6 lg:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
          
          {/* Fil d'Ariane / Bouton Retour */}
          <button 
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-gray-700 bg-[#f9fafb] border border-gray-200 px-3 py-1.5 rounded-full transition-all shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Retour aux demandes
          </button>

          <div className="max-w-2xl mx-auto space-y-6">
            
            {/* En-tête de section */}
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                Nouvelle demande de véhicule
              </h1>
              <p className="text-gray-400 text-xs mt-0.5 font-medium">
                Veuillez renseigner les détails logistiques de votre déplacement.
              </p>
            </div>

            {/* Boîte d'Alerte Erreur */}
            {error && (
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-3 text-rose-600 text-xs font-semibold">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Formulaire Principal */}
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Ligne : Motif de la demande */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-gray-400" /> Motif de la mission <span className="text-[#00b074]">*</span>
                </label>
                <div className="relative">
                  <select 
                    value={form.motif} 
                    onChange={e => setForm(p => ({ ...p, motif: e.target.value }))}
                    className="w-full px-4 py-3 bg-[#f9fafb] border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#00b074] focus:bg-white transition-all appearance-none cursor-pointer"
                  >
                    {MOTIFS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
              </div>

              {/* Ligne : Destination */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" /> Destination <span className="text-[#00b074]">*</span>
                </label>
                <input 
                  type="text" 
                  value={form.destination}
                  onChange={e => setForm(p => ({ ...p, destination: e.target.value }))}
                  placeholder="Ex: Antsirabe, Toamasina, Bureau central..."
                  className="w-full px-4 py-3 bg-[#f9fafb] border border-gray-200 rounded-xl text-xs font-semibold placeholder-gray-400 focus:outline-none focus:border-[#00b074] focus:bg-white transition-all" 
                />
              </div>

              {/* Ligne : Dates de déplacement (Grid 2 colonnes) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" /> Date & Heure départ <span className="text-[#00b074]">*</span>
                  </label>
                  <input 
                    type="datetime-local" 
                    value={form.date_depart}
                    min={new Date().toISOString().slice(0, 16)}
                    onChange={e => setForm(p => ({ ...p, date_depart: e.target.value }))}
                    className="w-full px-4 py-3 bg-[#f9fafb] border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:border-[#00b074] focus:bg-white transition-all" 
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" /> Date & Heure retour <span className="text-[#00b074]">*</span>
                  </label>
                  <input 
                    type="datetime-local" 
                    value={form.date_retour}
                    min={form.date_depart || new Date().toISOString().slice(0, 16)}
                    onChange={e => setForm(p => ({ ...p, date_retour: e.target.value }))}
                    className="w-full px-4 py-3 bg-[#f9fafb] border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:border-[#00b074] focus:bg-white transition-all" 
                  />
                </div>
              </div>

              {/* Ligne : Nombre de passagers */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-gray-400" /> Nombre de passagers
                </label>
                <input 
                  type="number" 
                  min={1} 
                  max={20} 
                  value={form.nombre_passagers}
                  onChange={e => setForm(p => ({ ...p, nombre_passagers: parseInt(e.target.value) || 1 }))}
                  className="w-full px-4 py-3 bg-[#f9fafb] border border-gray-200 rounded-xl text-xs font-bold text-gray-800 focus:outline-none focus:border-[#00b074] focus:bg-white transition-all" 
                />
              </div>

              {/* Ligne : Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-gray-400" /> Description / Précisions
                </label>
                <textarea 
                  value={form.description}
                  onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  rows={4} 
                  placeholder="Ajoutez des détails sur la nature du matériel à transporter ou l'urgence de la mission..."
                  className="w-full px-4 py-3 bg-[#f9fafb] border border-gray-200 rounded-xl text-xs font-semibold placeholder-gray-400 focus:outline-none focus:border-[#00b074] focus:bg-white transition-all resize-none leading-relaxed" 
                />
              </div>

              {/* Boutons d'actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => router.back()}
                  className="flex-1 py-3 border border-gray-200 text-gray-500 rounded-xl text-xs font-bold hover:bg-gray-50 hover:text-gray-700 transition-all"
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="flex-1 py-3 bg-[#00b074] text-white rounded-xl text-xs font-bold hover:bg-[#008f5d] transition-all disabled:opacity-50 shadow-md shadow-emerald-500/10 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      Traitement...
                    </>
                  ) : 'Soumettre le dossier'}
                </button>
              </div>

            </form>
          </div>
        </main>
      </div>
    </div>
  )
}