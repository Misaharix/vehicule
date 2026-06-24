'use client'
// Installation requise : npm install lucide-react
import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  label: string
  value: number | string
  icon: LucideIcon // Reçoit directement le composant Lucide (ex: Car, Users, etc.)
  color?: 'green' | 'blue' | 'orange' | 'purple' | 'red' // Palettes de couleurs prédéfinies
}

export function StatCard({ label, value, icon: Icon, color = 'green' }: StatCardProps) {
  // Mapping des classes Tailwind selon la couleur choisie pour un rendu harmonieux
  const colorClasses = {
    green: 'bg-emerald-50 text-emerald-700 border-emerald-100/50',
    blue: 'bg-blue-50 text-blue-700 border-blue-100/50',
    orange: 'bg-orange-50 text-orange-700 border-orange-100/50',
    purple: 'bg-purple-50 text-purple-700 border-purple-100/50',
    red: 'bg-red-50 text-red-700 border-red-100/50',
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex items-center justify-between group hover:shadow-md hover:border-gray-200/80 transition-all duration-200">
      <div className="space-y-1">
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
        <p className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight transition-transform group-hover:translate-x-0.5 duration-200">
          {value}
        </p>
      </div>

      {/* Conteneur d'icône stylisé avec badge de couleur dynamique */}
      <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shadow-sm transition-transform group-hover:scale-105 duration-200 ${colorClasses[color]}`}>
        <Icon className="w-5 h-5 stroke-[2.5]" />
      </div>
    </div>
  )
}