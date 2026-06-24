import api from './api'

const chauffeurService = {
  // Liste complète
  getAll: async () => {
    const res = await api.get('/chauffeurs/')
    return Array.isArray(res.data) ? res.data : res.data.results ?? []
  },

  // Chauffeurs disponibles
  getChauffeursDisponibles: async () => {
    const res = await api.get('/chauffeurs/')
    const list = Array.isArray(res.data) ? res.data : res.data.results ?? []
    return list.filter((c: any) => c.disponible)
  },

  // CRUD
  creer: async (data: any) => (await api.post('/chauffeurs/', data)).data,

  modifier: async (id: number, data: any) =>
    (await api.put(`/chauffeurs/${id}/`, data)).data,

  desactiver: async (id: number) =>
    (await api.delete(`/chauffeurs/${id}/`)).data,
}

export default chauffeurService