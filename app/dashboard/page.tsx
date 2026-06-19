'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import adminService from '@/services/adminService'

export default function AdminDashboardPage() {
  const router = useRouter()
  const { isAdminAuthenticated, isLoading: authLoading } = useAuth()
  const [stats, setStats] = useState({
    total_demandeurs: 0,
    total_vehicules: 0,
    total_chauffeurs: 0,
    total_demandes: 0,
    demandes_en_attente: 0,
    demandes_approuvees: 0,
    demandes_rejetees: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !isAdminAuthenticated) {
      router.push('/login')
    }
  }, [authLoading, isAdminAuthenticated, router])

  useEffect(() => {
    if (isAdminAuthenticated) {
      loadStats()
    }
  }, [isAdminAuthenticated])

  const loadStats = async () => {
    try {
      setIsLoading(true)
      setError(null)
      // Un seul appel — endpoint dédié admin, pas JWT
      const data = await adminService.getStats()
      setStats(data)
    } catch (err: any) {
      setError('Erreur lors du chargement des statistiques')
    } finally {
      setIsLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Chargement...</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Tableau de bord Admin</h1>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {isLoading ? (
        <p className="text-gray-500">Chargement des statistiques...</p>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Demandeurs" value={stats.total_demandeurs} icon="👥" color="blue" />
          <StatCard label="Véhicules" value={stats.total_vehicules} icon="🚗" color="green" />
          <StatCard label="Chauffeurs" value={stats.total_chauffeurs} icon="👤" color="purple" />
          <StatCard label="Demandes" value={stats.total_demandes} icon="📋" color="orange" />
          <StatCard label="En attente" value={stats.demandes_en_attente} icon="⏳" color="yellow" />
          <StatCard label="Approuvées" value={stats.demandes_approuvees} icon="✅" color="green" />
          <StatCard label="Rejetées" value={stats.demandes_rejetees} icon="❌" color="red" />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        <a href="/admin/demandeurs"
          className="bg-white border rounded-xl p-6 hover:shadow-lg transition text-center">
          <div className="text-3xl mb-2">👥</div>
          <h3 className="font-bold text-gray-900">Demandeurs</h3>
        </a>
        <a href="/admin/vehicules"
          className="bg-white border rounded-xl p-6 hover:shadow-lg transition text-center">
          <div className="text-3xl mb-2">🚗</div>
          <h3 className="font-bold text-gray-900">Véhicules</h3>
        </a>
        <a href="/admin/chauffeurs"
          className="bg-white border rounded-xl p-6 hover:shadow-lg transition text-center">
          <div className="text-3xl mb-2">👤</div>
          <h3 className="font-bold text-gray-900">Chauffeurs</h3>
        </a>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon, color }: {
  label: string
  value: number
  icon: string
  color: string
}) {
  return (
    <div className="bg-white border rounded-xl p-4 shadow-sm">
      <div className="text-2xl mb-1">{icon}</div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  )
}