'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Navbar } from '@/components/Navbar'
import { Sidebar } from '@/components/Sidebar'
import { StatCard } from '@/components/StatCard'
import adminService from '@/services/adminService'
import Link from 'next/link'
// Installation requise : npm install lucide-react
import { 
  Users, 
  Car, 
  UserCheck, 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Wallet,
  AlertTriangle,
  ArrowRight
} from 'lucide-react'

export default function AdminDashboardPage() {
  const router = useRouter()
  const { isAdminAuthenticated, isLoading: authLoading } = useAuth()
  const [stats, setStats] = useState({
    total_demandeurs: 0, total_vehicules: 0,
    total_chauffeurs: 0, total_demandes: 0,
    demandes_en_attente: 0, demandes_approuvees: 0, demandes_rejetees: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!authLoading && !isAdminAuthenticated) router.push('/login')
  }, [authLoading, isAdminAuthenticated, router])

  useEffect(() => {
    if (isAdminAuthenticated) loadStats()
  }, [isAdminAuthenticated])

  const loadStats = async () => {
    try {
      setIsLoading(true)
      const data = await adminService.getStats()
      setStats(data)
    } catch { 
      setError('Erreur lors du chargement des statistiques globales') 
    } finally { 
      setIsLoading(false) 
    }
  }

  if (authLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-[#1a5c38] rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium text-sm">Chargement de l'espace administration...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)]">
        <Sidebar />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-10">
          
          {/* Header style Oovoom / UCP */}
          <div className="mb-8">
            <span className="text-[10px] uppercase tracking-[2px] font-bold text-gray-400">Supervision</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-0.5">Tableau de bord Admin</h1>
            <p className="text-gray-500 text-xs sm:text-sm mt-1">Vue d'ensemble et contrôle global du système logistique</p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl mb-6 text-red-700 text-sm flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <p className="font-medium">{error}</p>
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center py-20">
               <div className="w-10 h-10 border-4 border-gray-200 border-t-[#1a5c38] rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {/* Grille des cartes KPI Re-stylisée avec le nouveau composant StatCard */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
                <StatCard label="Demandeurs" value={stats.total_demandeurs} icon={Users} color="purple" />
                <StatCard label="Véhicules" value={stats.total_vehicules} icon={Car} color="green" />
                <StatCard label="Chauffeurs" value={stats.total_chauffeurs} icon={UserCheck} color="blue" />
                <StatCard label="Total Demandes" value={stats.total_demandes} icon={FileText} color="purple" />
                <StatCard label="Demandes en attente" value={stats.demandes_en_attente} icon={Clock} color="orange" />
                <StatCard label="Demandes Approuvées" value={stats.demandes_approuvees} icon={CheckCircle} color="green" />
                <StatCard label="Demandes Rejetées" value={stats.demandes_rejetees} icon={XCircle} color="red" />
              </div>

              {/* Section d'accès et d'actions rapides */}
              <div className="mb-4">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Raccourcis de gestion</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { href: '/admin/demandeurs', icon: Users, label: 'Demandeurs', color: 'text-purple-600 bg-purple-50' },
                    { href: '/admin/vehicules', icon: Car, label: 'Véhicules', color: 'text-emerald-600 bg-emerald-50' },
                    { href: '/admin/chauffeurs', icon: UserCheck, label: 'Chauffeurs', color: 'text-blue-600 bg-blue-50' },
                    { href: '/admin/financements', icon: Wallet, label: 'Financements', color: 'text-orange-600 bg-orange-50' },
                  ].map(({ href, icon: Icon, label, color }) => (
                    <Link 
                      key={href} 
                      href={href}
                      className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-lg hover:border-gray-200/60 transition-all duration-200 flex flex-col justify-between items-start group relative overflow-hidden h-36"
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ${color}`}>
                        <Icon className="w-5 h-5 stroke-[2.2]" />
                      </div>
                      
                      <div className="w-full flex items-center justify-between mt-4">
                        <h3 className="font-extrabold text-gray-900 text-sm">{label}</h3>
                        <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#1a5c38] group-hover:text-white transition-all">
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}