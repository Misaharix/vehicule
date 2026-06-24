import api from './api'

const validationService = {
  getDemandesAValider: async () => (await api.get('/validations/')).data,

  validerDemande: async (id: number, data: {
    decision: 'approuve' | 'rejete'
    commentaire?: string
    vehicule_id?: number | null
    chauffeur_id?: number | null
  }) => (await api.post(`/validations/${id}/`, data)).data,
}

export default validationService