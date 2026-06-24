import api from './api'

const financementService = {
  getFinancements: async () => (await api.get('/financements/')).data,
  creerFinancement: async (data: { nom: string }) => (await api.post('/financements/', data)).data,
  modifierFinancement: async (id: number, data: { nom: string }) => (await api.put(`/financements/${id}/`, data)).data,
  supprimerFinancement: async (id: number) => { await api.delete(`/financements/${id}/`) },
}

export default financementService