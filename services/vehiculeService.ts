import api from './api'

const vehiculeService = {
  // Liste complète
  getAll: async () => {
    const res = await api.get('/vehicules/')
    return Array.isArray(res.data) ? res.data : res.data.results ?? []
  },

  // Véhicules disponibles
  getVehiculesDisponibles: async (date_depart?: string, date_retour?: string) => {
    const params = date_depart && date_retour
      ? `?date_depart=${date_depart}&date_retour=${date_retour}`
      : ''
    return (await api.get(`/vehicules/disponibles/${params}`)).data
  },

  // Missions en cours
  getMissionsEnCours: async () => (await api.get('/missions/en-cours/')).data,

  // CRUD
  creer: async (data: any) => (await api.post('/vehicules/', data)).data,

  modifier: async (id: number, data: any) =>
    (await api.put(`/vehicules/${id}/`, data)).data,

  desactiver: async (id: number) =>
    (await api.delete(`/vehicules/${id}/`)).data,
}

export default vehiculeService