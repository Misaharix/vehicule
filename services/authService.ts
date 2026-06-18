import api from './api'

const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login/', { email, password })
    const data = response.data
    localStorage.setItem('access_token', data.access)
    localStorage.setItem('refresh_token', data.refresh)
    return data
  },

  logout: async () => {
    const refresh = localStorage.getItem('refresh_token')
    await api.post('/auth/logout/', { refresh })
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
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
    return response.data
  },

  adminLogout: async () => {
    await api.post('/auth/admin/logout/', {})
  },

  getCurrentAdmin: async () => {
    try {
      const response = await api.get('/auth/admin/me/')
      return response.data
    } catch {
      return null
    }
  },
}

export default authService