'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useState, useEffect, useRef } from 'react'
// Installation requise : npm install lucide-react
import { Car, ChevronDown, LogOut, User, ShieldAlert } from 'lucide-react'

export function Navbar() {
  const { user, isAuthenticated, logout, admin, isAdminAuthenticated, adminLogout } = useAuth()
  const router = useRouter()
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Fermer le menu si on clique en dehors
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    if (isAdminAuthenticated) await adminLogout()
    else await logout()
    setShowMenu(false)
    router.push('/login')
  }

  const displayName = user
    ? `${user.first_name} ${user.last_name}`.trim() || user.username
    : admin
      ? `${admin.prenom} ${admin.nom}`.trim()
      : 'UCP Santé'

  const userRoleLabel = isAdminAuthenticated 
    ? 'Administrateur' 
    : user?.role === 'logistique' 
      ? 'Gestion Logistique' 
      : user?.role || 'Utilisateur'

  return (
    <nav className="bg-[#1a5c38] text-white shadow-md sticky top-0 z-50 border-b border-white/5 backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo et Lien d'accueil */}
          <Link 
            href={isAdminAuthenticated ? '/admin/dashboard' : isAuthenticated ? '/dashboard' : '/login'}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center border border-white/10 group-hover:bg-white/20 transition-all shadow-inner">
              <Car className="w-5 h-5 text-white transform group-hover:scale-110 transition-transform" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-black tracking-wide leading-tight">UCP Santé</span>
              <span className="text-[10px] text-green-200/80 uppercase font-bold tracking-widest hidden sm:inline-block">Plateforme Logistique</span>
            </div>
          </Link>

          {/* Espace Utilisateur & Dropdown */}
          {(isAuthenticated || isAdminAuthenticated) && (
            <div className="relative" ref={menuRef}>
              <button 
                onClick={() => setShowMenu(!showMenu)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all text-sm font-semibold select-none border border-transparent ${
                  showMenu ? 'bg-white/10 border-white/10' : 'hover:bg-white/5'
                }`}
              >
                {/* Petit avatar avec initiales */}
                <div className="w-7 h-7 rounded-lg bg-white/15 border border-white/10 flex items-center justify-center text-xs font-bold uppercase tracking-tighter">
                  {displayName[0]}
                </div>
                <span className="truncate max-w-[120px] sm:max-w-[160px]">{displayName}</span>
                <ChevronDown className={`w-4 h-4 text-green-200 transition-transform duration-200 ${showMenu ? 'rotate-180' : ''}`} />
              </button>

              {/* Menu déroulant ré-stylisé */}
              {showMenu && (
                <div className="absolute right-0 mt-2.5 w-56 bg-white text-gray-800 rounded-2xl shadow-xl border border-gray-100 z-50 transform origin-top-right transition-all overflow-hidden p-1.5 animate-in fade-in slide-in-from-top-2 duration-150">
                  
                  {/* Entête du profil dans le dropdown */}
                  <div className="px-3.5 py-3 border-b border-gray-50 bg-gray-50/50 rounded-xl mb-1">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Session active</p>
                    <p className="text-sm font-black text-gray-900 truncate mt-1">{displayName}</p>
                    <p className="text-[11px] font-bold text-[#1a5c38] mt-0.5 inline-flex items-center gap-1 bg-green-50 px-1.5 py-0.5 rounded border border-green-100/50">
                      {isAdminAuthenticated ? <ShieldAlert className="w-3 h-3" /> : <User className="w-3 h-3" />}
                      {userRoleLabel}
                    </p>
                  </div>

                  {/* Bouton de Déconnexion */}
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2.5 text-xs font-bold rounded-xl hover:bg-red-50 text-red-600 transition-colors flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4 flex-shrink-0 text-red-500" />
                    Se déconnecter de l'application
                  </button>
                  
                </div>
              )}
            </div>
          )}
          
        </div>
      </div>
    </nav>
  )
}