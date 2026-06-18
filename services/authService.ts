import api from './api'

const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login/', { email, password })
    const data = response.data

    // Sauvegarder les tokens
    if (data.access) {
      localStorage.setItem('access_token', data.access)
    }
    if (data.refresh) {
      localStorage.setItem('refresh_token', data.refresh)
    }

    return data
  },

  logout: async () => {
    const refresh = localStorage.getItem('refresh_token')
    try {
      await api.post('/auth/logout/', { refresh })
    } catch {
      // ignorer l'erreur logout
    } finally {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
    }
  },

  getCurrentUser: async () => {
    try {
      const token = localStorage.getItem('access_token')
      if (!token) return null
      const response = await api.get('/auth/me/')
      return response.data
    } catch {
      return null
    }
  },

  adminLogin: async (email: string, password: string) => {
    const response = await api.post('/auth/admin/login/', { email, password })
    const data = response.data
    // Admin utilise la session Django — pas de token JWT
    localStorage.setItem('admin_data', JSON.stringify(data))
    return data
  },

  adminLogout: async () => {
    try {
      await api.post('/auth/admin/logout/', {})
    } catch {
      // ignorer
    } finally {
      localStorage.removeItem('admin_data')
    }
  },

  getCurrentAdmin: async () => {
    try {
      const adminData = localStorage.getItem('admin_data')
      if (!adminData) return null
      const response = await api.get('/auth/admin/me/')
      return response.data
    } catch {
      return null
    }
  },
}

export default authService