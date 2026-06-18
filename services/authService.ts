import axios from 'axios';
import api, { handleApiError } from './api';
import { User, Admin } from '@/types';

// Interface temporaire pour mapper la réponse de votre Django avec les tokens à la racine
interface BackendAuthResponse {
  access?: string;
  refresh?: string;
  [key: string]: any; 
}
interface RegisterResult {
  status: number;
  success: boolean;
  message: string;
}

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
export const adminRegister = async (
  username: string,
  password: string,
  email: string,
  nom: string,
  prenom: string,
): Promise<RegisterResult> => {
  try {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('nom', nom);
    formData.append('prenom', prenom);

    await api.post(
      `/auth/admin/register/`, 
      formData, 
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );

    return { status: 201, success: true, message: "Profil enregistré" };

  } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      const result = error.response.data;


      return {
        status: status,
        success: false,
        message: result.message,
      };
    }
    return { status: 500, success: false, message: "Erreur de connexion au serveur" };
  }
};

export default authService