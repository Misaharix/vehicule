import api from './api'

const API_URL = 'http://localhost:8000/api'

// ── Helpers JWT ───────────────────────────────────────────────
const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('admin_access_token')}`,
})

// ── Stats ─────────────────────────────────────────────────────
const getStats = async () => {
  const response = await fetch(`${API_URL}/admin/stats/`, {
    headers: getAuthHeaders(),
  })
  if (!response.ok) throw new Error('Erreur stats')
  return response.json()
}

// ── Service principal ─────────────────────────────────────────
const adminService = {
  getStats,

  // Demandeurs
  getDemandeurs: async () => {
    const response = await api.get('/admin/demandeurs/')
    return response.data
  },
  creerDemandeur: async (data: any) => {
    const response = await api.post('/admin/demandeurs/', data)
    return response.data
  },
  modifierDemandeur: async (id: number, data: any) => {
    const response = await api.put(`/admin/demandeurs/${id}/`, data)
    return response.data
  },
  desactiverDemandeur: async (id: number) => {
    await api.delete(`/admin/demandeurs/${id}/`)
  },

  // Véhicules
  getVehicules: async () => {
    const response = await api.get('/admin/vehicules/')
    return response.data
  },
  creerVehicule: async (data: any) => {
    const response = await api.post('/admin/vehicules/', data)
    return response.data
  },
  modifierVehicule: async (id: number, data: any) => {
    const response = await api.put(`/admin/vehicules/${id}/`, data)
    return response.data
  },
  desactiverVehicule: async (id: number) => {
    await api.delete(`/admin/vehicules/${id}/`)
  },

  // Chauffeurs
  getChauffeurs: async () => {
    const response = await api.get('/admin/chauffeurs/')
    return response.data
  },
  creerChauffeur: async (data: any) => {
    const response = await api.post('/admin/chauffeurs/', data)
    return response.data
  },
  modifierChauffeur: async (id: number, data: any) => {
    const response = await api.put(`/admin/chauffeurs/${id}/`, data)
    return response.data
  },
  desactiverChauffeur: async (id: number) => {
    await api.delete(`/admin/chauffeurs/${id}/`)
  },
}

export default adminService