import api from './api'

const adminService = {
  getStats: async () => {
    const res = await api.get('/admin/stats/')
    return res.data
  },

  // Demandeurs
  getDemandeurs: async () => (await api.get('/admin/demandeurs/')).data,
  creerDemandeur: async (data: any) => (await api.post('/admin/demandeurs/', data)).data,
  modifierDemandeur: async (id: number, data: any) => (await api.put(`/admin/demandeurs/${id}/`, data)).data,
  desactiverDemandeur: async (id: number) => { await api.delete(`/admin/demandeurs/${id}/`) },

  // Véhicules
  getVehicules: async () => (await api.get('/admin/vehicules/')).data,
  creerVehicule: async (data: any) => (await api.post('/admin/vehicules/', data)).data,
  modifierVehicule: async (id: number, data: any) => (await api.put(`/admin/vehicules/${id}/`, data)).data,
  desactiverVehicule: async (id: number) => { await api.delete(`/admin/vehicules/${id}/`) },

  // Chauffeurs
  getChauffeurs: async () => (await api.get('/admin/chauffeurs/')).data,
  creerChauffeur: async (data: any) => (await api.post('/admin/chauffeurs/', data)).data,
  modifierChauffeur: async (id: number, data: any) => (await api.put(`/admin/chauffeurs/${id}/`, data)).data,
  desactiverChauffeur: async (id: number) => { await api.delete(`/admin/chauffeurs/${id}/`) },
}

export default adminService