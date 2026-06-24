import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    // Prend admin token en priorité, sinon user token
    const token = localStorage.getItem('admin_access_token') 
                ?? localStorage.getItem('access_token')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      try {
        const refresh = localStorage.getItem('refresh_token')
        if (!refresh) throw new Error('no refresh')
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/auth/token/refresh/`,
          { refresh }
        )
        localStorage.setItem('access_token', res.data.access)
        original.headers.Authorization = `Bearer ${res.data.access}`
        return api(original)
      } catch {
        if (typeof window !== 'undefined') {
          const adminLogged = localStorage.getItem('admin_logged')
          if (!adminLogged) {
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
            localStorage.removeItem('user_data')
            window.location.href = '/login'
          }
        }
      }
    }
    return Promise.reject(error)
  }
)

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