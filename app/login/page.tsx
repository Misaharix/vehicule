'use client'
import { useState, FormEvent, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import Image from 'next/image'
import { Mail, Lock, AlertCircle, Shield, User } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const { login, adminLogin, isLoading: authLoading, error, isAuthenticated, isAdminAuthenticated, user } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })
  const [localError, setLocalError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!authLoading) {
      if (isAdminAuthenticated) {
        router.push('/admin/dashboard')
      } else if (isAuthenticated && user) {
        switch (user.role) {
          case 'Logistique':
            router.push('/logistique/dashboard')
            break
          case 'Chef':
          case 'Directeur':
            router.push('/validations')
            break
          default:
            router.push('/dashboard')
        }
      }
    }
  }, [isAuthenticated, isAdminAuthenticated, authLoading, user, router])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLocalError('')

    if (!form.email || !form.password) {
      setLocalError('Veuillez remplir tous les champs requis')
      return
    }

    try {
      setIsSubmitting(true)
      if (isAdmin) {
        await adminLogin(form.email, form.password)
      } else {
        await login(form.email, form.password)
      }
    } catch (err: any) {
      setLocalError(err.message || 'Identifiants ou accès invalides')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex flex-col items-center justify-center p-4 antialiased">
      <div className="w-full max-w-[420px] space-y-6">
        
        {/* En-tête avec Logo UCP */}
        <div className="flex flex-col items-center text-center">
          <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm mb-4">
            <Image 
              src="/ucp.jpeg" 
              alt="Logo UCP Santé" 
              width={64} 
              height={64} 
              className="object-contain rounded-xl"
              priority
            />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">UCP Santé</h1>
          <p className="text-gray-400 text-xs font-medium mt-1">Gestion de la Flotte Automobile & Validations</p>
        </div>

        {/* Boîte de Connexion Blanche */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
          
          {/* Onglets de Rôle Séparés */}
          <div className="flex p-1 bg-gray-50 border border-gray-100 rounded-xl">
            {[
              { label: 'Utilisateur', value: false, icon: User },
              { label: 'Administration', value: true, icon: Shield }
            ].map((tab) => {
              const Icon = tab.icon
              const isSelected = isAdmin === tab.value
              return (
                <button
                  key={tab.label}
                  type="button"
                  onClick={() => setIsAdmin(tab.value)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold rounded-lg transition-all duration-200 ${
                    isSelected
                      ? 'bg-white text-[#00b074] shadow-sm font-extrabold'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#00b074]' : 'text-gray-400'}`} />
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Alertes d'Erreurs */}
          {(localError || error) && (
            <div className="p-3.5 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-2.5 text-rose-600 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{localError || error}</span>
            </div>
          )}

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Champ Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Adresse e-mail</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                  <Mail className="w-4 h-4 stroke-[2]" />
                </span>
                <input 
                  type="email" 
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  placeholder="nom@ucpsante.org"
                  disabled={isSubmitting}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00b074]/20 focus:border-[#00b074] transition disabled:opacity-50" 
                />
              </div>
            </div>

            {/* Champ Mot de passe */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Mot de passe</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4 stroke-[2]" />
                </span>
                <input 
                  type="password" 
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  placeholder="••••••••••••"
                  disabled={isSubmitting}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00b074]/20 focus:border-[#00b074] transition disabled:opacity-50" 
                />
              </div>
            </div>

            {/* Bouton de Validation */}
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[#00b074] text-white font-bold text-xs rounded-xl hover:bg-[#008f5d] transition-all duration-200 shadow-md shadow-emerald-500/10 disabled:opacity-50 tracking-wide mt-2"
            >
              {isSubmitting ? 'Authentification en cours...' : 'Se connecter'}
            </button>
          </form>
        </div>

        {/* Pied de page */}
        <p className="text-center text-gray-400 text-[11px] font-medium">
          &copy; 2026 UCP Santé &mdash; Plateforme Interne Sécurisée
        </p>
      </div>
    </div>
  )
}