import api from './api'

const demandeService = {
  getMesDemandes: async () => (await api.get('/demandes/')).data,

  getDemandeById: async (id: number) => (await api.get(`/demandes/${id}/`)).data,

  creerDemande: async (data: {
    motif: string
    destination: string
    description?: string
    date_depart: string
    date_retour: string
    nombre_passagers: number
  }) => (await api.post('/demandes/', data)).data,

  annulerDemande: async (id: number) => { await api.delete(`/demandes/${id}/`) },
}

export default demandeService