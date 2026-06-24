'use client'
import { useState, FormEvent, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

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
      setLocalError('Veuillez remplir tous les champs')
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
      setLocalError(err.message || 'Erreur de connexion')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a5c38] to-[#0d3d22] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🚗</div>
          <h1 className="text-3xl font-bold text-white">UCP Santé</h1>
          <p className="text-[#3aaa35] text-sm mt-1">Gestion des demandes de véhicules</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex gap-1 mb-6 border-b border-gray-200">
            {['Utilisateur', 'Admin'].map((tab, i) => (
              <button key={tab} type="button" onClick={() => setIsAdmin(i === 1)}
                className={`flex-1 pb-3 text-sm font-medium transition ${
                  isAdmin === (i === 1)
                    ? 'border-b-2 border-[#1a5c38] text-[#1a5c38]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}>
                {tab}
              </button>
            ))}
          </div>

          {(localError || error) && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{localError || error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                placeholder="votre@email.com"
                disabled={isSubmitting}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5c38] disabled:opacity-50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
              <input type="password" value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                placeholder="••••••••"
                disabled={isSubmitting}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5c38] disabled:opacity-50" />
            </div>
            <button type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 bg-[#1a5c38] text-white font-semibold rounded-lg hover:bg-[#0d3d22] transition disabled:opacity-50 text-sm">
              {isSubmitting ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        </div>
        <p className="text-center text-gray-300 text-xs mt-6">© 2026 UCP Santé</p>
      </div>
    </div>
  )
}