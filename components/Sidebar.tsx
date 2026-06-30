'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRole } from '@/hooks/useRole'
import { useState } from 'react'
// Installation requise : npm install lucide-react
import { 
  BarChart3, 
  Users, 
  Car, 
  UserCheck, 
  Wallet, 
  CheckSquare, 
  FileText, 
  PlusCircle, 
  Menu, 
  X,
  Shield,
  Briefcase
} from 'lucide-react'

export function Sidebar() {
  const pathname = usePathname()
  const { userRole, isAdmin, isLogistique, isChef, isDirecteur } = useRole()
  const [open, setOpen] = useState(false)

  if (!userRole && !isAdmin) return null

  const isActive = (p: string) => pathname === p

  // Catalogues de liens ré-architecturés avec composants Lucide
  const adminLinks = [
    { href: '/admin/dashboard',    label: 'Tableau de bord',       icon: BarChart3 },
    { href: '/admin/demandeurs',   label: 'Demandeurs',            icon: Users },
    { href: '/admin/vehicules',    label: 'Véhicules',             icon: Car },
    { href: '/admin/chauffeurs',   label: 'Chauffeurs',            icon: UserCheck },
    { href: '/admin/financements', label: 'Financements',          icon: Wallet },
  ]

  const logistiqueLinks = [
    { href: '/logistique/dashboard', label: 'Tableau de bord',     icon: BarChart3 },
    { href: '/validations',          label: 'Demandes à valider',   icon: CheckSquare },
    { href: '/logistique/vehicules', label: 'Véhicules',           icon: Car },
    { href: '/logistique/chauffeurs',label: 'Chauffeurs',          icon: UserCheck },
    { href: '/demandes',    label: 'Mes demandes',         icon: FileText },
    { href: '/demandes/new',label: 'Nouvelle demande',     icon: PlusCircle },
  ]

  const chefLinks = [
    { href: '/dashboard',   label: 'Tableau de bord',     icon: BarChart3 },
    { href: '/validations', label: 'Demandes à valider',   icon: CheckSquare },
    { href: '/demandes',    label: 'Mes demandes',         icon: FileText },
    { href: '/demandes/new',label: 'Nouvelle demande',     icon: PlusCircle },
  ]

  const directeurLinks = [
    { href: '/dashboard',   label: 'Tableau de bord',     icon: BarChart3 },
    { href: '/validations', label: 'Demandes à valider',   icon: CheckSquare },
    { href: '/demandes',    label: 'Mes demandes',         icon: FileText },
  ]

  const demandeurLinks = [
    { href: '/dashboard',    label: 'Tableau de bord',     icon: BarChart3 },
    { href: '/demandes',     label: 'Mes demandes',         icon: FileText },
    { href: '/demandes/new', label: 'Nouvelle demande',     icon: PlusCircle },
  ]

  const getLinks = () => {
    if (isAdmin)       return adminLinks
    if (isLogistique)  return logistiqueLinks
    if (isChef)        return chefLinks
    if (isDirecteur)   return directeurLinks
    return demandeurLinks
  }

  const getRoleLabel = () => {
    if (isAdmin) return 'Administrateur'
    if (isLogistique) return 'Logistique UCP'
    if (isChef) return 'Chef de Service'
    if (isDirecteur) return 'Directeur'
    return 'Demandeur'
  }

  const links = getLinks()

  return (
    <>
      {/* Bouton Toggle Mobile - Stylisé et flottant discrètement */}
      <button
        onClick={() => setOpen(!open)}
        className="lg:hidden fixed left-4 bottom-6 z-50 p-3.5 bg-[#1a5c38] text-white rounded-full shadow-xl hover:bg-[#0d3d22] active:scale-95 transition-all flex items-center justify-center border border-white/10"
        aria-label="Menu de navigation"
      >
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Conteneur de l'Aside */}
      <aside className={`
        fixed lg:sticky left-0 top-16 h-[calc(100vh-64px)] w-64 bg-white border-r border-gray-100 z-40 
        transform transition-transform duration-200 ease-in-out lg:translate-x-0
        ${open ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
      `}>
        <nav className="p-4 space-y-1.5 overflow-y-auto h-full flex flex-col">
          
          {/* Badge Rôle - Version épurée "Card Pill" */}
          <div className="mb-4 px-3.5 py-2.5 bg-gray-50/80 rounded-xl border border-gray-100 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-green-50 border border-green-100 flex items-center justify-center text-[#1a5c38]">
              {isAdmin ? <Shield className="w-4 h-4" /> : <Briefcase className="w-4 h-4" />}
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none">Espace Privé</p>
              <p className="text-xs font-black text-[#1a5c38] mt-0.5">{getRoleLabel()}</p>
            </div>
          </div>

          {/* Liste Dynamique des Liens */}
          <div className="space-y-1 flex-1">
            {links.map(({ href, label, icon: Icon }) => {
              const currentActive = isActive(href)
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all group relative ${
                    currentActive
                      ? 'bg-[#1a5c38] text-white shadow-sm shadow-green-100/50'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-105 ${
                    currentActive ? 'text-white' : 'text-gray-400 group-hover:text-[#1a5c38]'
                  }`} />
                  
                  <span className="truncate">{label}</span>

                  {/* Petite barre indicatrice au survol (uniquement pour les éléments inactifs) */}
                  {!currentActive && (
                    <div className="absolute left-0 w-1 h-0 bg-[#1a5c38] rounded-r-lg group-hover:h-4 transition-all duration-150 top-1/2 -translate-y-1/2" />
                  )}
                </Link>
              )
            })}
          </div>
          
        </nav>
      </aside>

      {/* Arrière-plan flouté (Overlay) sur mobile */}
      {open && (
        <div
          className="fixed lg:hidden inset-0 bg-gray-900/30 backdrop-blur-sm z-30 transition-opacity"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  )
}