import api from './api'

const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login/', { email, password })
    const data = response.data
    if (data.access) {
      localStorage.setItem('access_token', data.access)
      localStorage.setItem('refresh_token', data.refresh)
      localStorage.setItem('user_data', JSON.stringify(data))
    }
    return data
  },

  logout: async () => {
    try {
      const refresh = localStorage.getItem('refresh_token')
      await api.post('/auth/logout/', { refresh })
    } catch {
      // ignorer
    } finally {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user_data')
    }
  },

  getCurrentUser: async () => {
    // Ne pas appeler l'API si pas de token
    const token = localStorage.getItem('access_token')
    if (!token) return null

    try {
      const response = await api.get('/auth/me/')
      return response.data
    } catch {
      // Token expiré ou invalide → retourner null sans erreur
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user_data')
      return null
    }
  },

  adminLogin: async (email: string, password: string) => {
    const response = await api.post('/auth/admin/login/', { email, password })
    const data = response.data

    // ✅ Ajoute cette ligne manquante
    localStorage.setItem('admin_access_token', data.access)

    localStorage.setItem('admin_data', JSON.stringify(data))
    localStorage.setItem('admin_logged', 'true')
    return data
  },

  adminLogout: async () => {
    try {
      await api.post('/auth/admin/logout/', {})
    } catch {
      // ignorer
    } finally {
      localStorage.removeItem('admin_access_token')  // ✅ ajoute ça
      localStorage.removeItem('admin_data')
      localStorage.removeItem('admin_logged')
    }
  },

  getCurrentAdmin: async () => {
    // Pas d'appel API — juste localStorage
    const adminLogged = localStorage.getItem('admin_logged')
    const adminData = localStorage.getItem('admin_data')
    if (!adminLogged || !adminData) return null
    try {
      return JSON.parse(adminData)
    } catch {
      return null
    }
  },
}


export default authService