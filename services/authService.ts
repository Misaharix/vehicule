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

class AuthService {
  /**
   * Connexion Utilisateur
   */
  async login(email: string, password: string): Promise<User> {
    try {
      const response = await api.post<BackendAuthResponse>('/auth/login/', { email, password });
      const data = response.data;

      // Sauvegarde des tokens JWT dans le navigateur
      if (data.access) localStorage.setItem('access_token', data.access);
      if (data.refresh) localStorage.setItem('refresh_token', data.refresh);

      // Le JSON de Django contenant directement le profil à la racine, on retourne 'data' directement
      return data as unknown as User;
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Récupérer le profil de l'utilisateur connecté via son Token
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await api.get<BackendAuthResponse>('/auth/me/');
      return (response.data as unknown as User) || null;
    } catch (error: any) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        return null;
      }
      console.error('Erreur getCurrentUser:', handleApiError(error));
      return null;
    }
  }

  /**
   * Connexion Administrateur
   */
  async adminLogin(email: string, password: string): Promise<Admin> {
    try {
      const response = await api.post<BackendAuthResponse>('/auth/admin/login/', { email, password });
      const data = response.data;

      if (data.access) localStorage.setItem('access_token', data.access);
      if (data.refresh) localStorage.setItem('refresh_token', data.refresh);

      return data as unknown as Admin;
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Récupérer le profil de l'administrateur connecté
   */
  async getCurrentAdmin(): Promise<Admin | null> {
    try {
      const response = await api.get<BackendAuthResponse>('/auth/admin/me/');
      return (response.data as unknown as Admin) || null;
    } catch (error: any) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        return null;
      }
      console.error('Erreur getCurrentAdmin:', handleApiError(error));
      return null;
    }
  }

  /**
   * Déconnexion complète
   */
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout/');
    } catch (error) {
      console.error('Logout error:', handleApiError(error));
    } finally {
      // Quoiqu'il arrive (même si le serveur est éteint), on supprime les tokens en local
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }
    }
  }
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

const authService = new AuthService();
export default authService;