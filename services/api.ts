import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// Ajouter le token JWT à chaque requête
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// Si 401 → essayer de rafraîchir le token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const adminToken = localStorage.getItem('admin_access_token')
    const userToken  = localStorage.getItem('access_token')
    const token      = adminToken || userToken

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

export const handleApiError = (error: any): string => {
  if (error.response) {
    const data = error.response.data
    if (typeof data === 'string') return data
    if (data?.error) return data.error
    if (data?.detail) return data.detail
    return `Erreur ${error.response.status}`
  }
  return error.message || 'Erreur réseau'
}

export default api