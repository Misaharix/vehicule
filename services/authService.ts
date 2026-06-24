import api from './api'

const authService = {
    login: async (email: string, password: string) => {
    // ✅ Nettoyer d'abord tous les tokens existants
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user_data')
    localStorage.removeItem('admin_access_token')
    localStorage.removeItem('admin_data')
    localStorage.removeItem('admin_logged')

    const res = await api.post('/auth/login/', { email, password })
    const data = res.data
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
    } catch {}
    finally {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user_data')
    }
  },

  getCurrentUser: async () => {
  const token = localStorage.getItem('access_token')
  if (!token) return null
  try {
    const res = await api.get('/auth/me/')
    console.log('>>> ME RESPONSE:', res.data)  // ← ajoute ça
    return res.data
  } catch (e) {
    console.log('>>> ME ERROR:', e)  // ← et ça
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user_data')
    return null
  }
},

  adminLogin: async (email: string, password: string) => {
    const response = await api.post('/auth/admin/login/', { email, password })
    const data = response.data
    
    console.log('>>> DATA ADMIN LOGIN:', data)  // ← ajoute ça
    console.log('>>> ACCESS TOKEN:', data.access)  // ← et ça

    localStorage.setItem('admin_access_token', data.access)
    localStorage.setItem('admin_data', JSON.stringify(data))
    localStorage.setItem('admin_logged', 'true')
    return data
  },

  adminLogout: async () => {
    try {
      await api.post('/auth/admin/logout/', {})
    } catch {}
    finally {
      localStorage.removeItem('admin_data')
      localStorage.removeItem('admin_logged')
    }
  },

  getCurrentAdmin: async () => {
    const adminLogged = localStorage.getItem('admin_logged')
    const adminData = localStorage.getItem('admin_data')
    if (!adminLogged || !adminData) return null
    try { return JSON.parse(adminData) } catch { return null }
  },
}

export default authService