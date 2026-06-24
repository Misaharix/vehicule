'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Navbar } from '@/components/Navbar'
import { Sidebar } from '@/components/Sidebar'
import { Modal } from '@/components/Modal'
import financementService from '@/services/financementService'
import { Financement } from '@/types'

export default function FinancementsAdminPage() {
  const router = useRouter()
  const { isAdminAuthenticated, isLoading: authLoading } = useAuth()
  const [financements, setFinancements] = useState<Financement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [nom, setNom] = useState('')

  useEffect(() => { if (!authLoading && !isAdminAuthenticated) router.push('/login') }, [authLoading, isAdminAuthenticated, router])
  useEffect(() => { if (isAdminAuthenticated) load() }, [isAdminAuthenticated])

  const load = async () => {
    try { setIsLoading(true); setFinancements(await financementService.getFinancements()) }
    catch { setError('Erreur chargement') } finally { setIsLoading(false) }
  }

  const handleOpen = (f?: Financement) => {
    if (f) { setEditingId(f.id); setNom(f.nom) }
    else { setEditingId(null); setNom('') }
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nom.trim()) { setError('Le nom est requis'); return }
    try {
      if (editingId) await financementService.modifierFinancement(editingId, { nom })
      else await financementService.creerFinancement({ nom })
      setShowModal(false); load()
    } catch { setError('Erreur enregistrement') }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer ce financement ?')) return
    try { await financementService.supprimerFinancement(id); load() }
    catch { setError('Erreur suppression') }
  }

  if (authLoading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin text-4xl">🔄</div></div>

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar /><div className="flex"><Sidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Gestion Financements</h1>
          <button onClick={() => handleOpen()} className="px-4 py-2 bg-[#1a5c38] text-white rounded-lg text-sm font-medium hover:bg-[#0d3d22]">+ Ajouter</button>
        </div>
        {error && <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6 text-red-700 text-sm">{error}</div>}
        {isLoading ? <div className="text-center py-12"><div className="animate-spin text-4xl">🔄</div></div> : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {financements.length === 0 ? (
              <p className="p-8 text-center text-gray-500">Aucun financement</p>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>{['ID', 'Nom', 'Actions'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {financements.map(f => (
                    <tr key={f.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-400 text-xs">#{f.id}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{f.nom}</td>
                      <td className="px-4 py-3 space-x-2">
                        <button onClick={() => handleOpen(f)} className="text-[#1a5c38] hover:underline text-xs font-medium">Éditer</button>
                        <button onClick={() => handleDelete(f.id)} className="text-red-600 hover:underline text-xs font-medium">Suppr.</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </main></div>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingId ? 'Modifier financement' : 'Nouveau financement'} size="sm"
        actions={<><button onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm">Annuler</button><button onClick={handleSubmit} className="px-4 py-2 bg-[#1a5c38] text-white rounded-lg text-sm">Enregistrer</button></>}>
        <form onSubmit={e => e.preventDefault()}>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom du financement</label>
          <input value={nom} onChange={e => setNom(e.target.value)} placeholder="Ex: FM, GAVI, PARN..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5c38]" />
        </form>
      </Modal>
    </div>
  )
}