import api, { handleApiError } from './api';
import { User, Admin } from '@/types';

// Interface temporaire pour mapper la réponse de votre Django avec les tokens à la racine
interface BackendAuthResponse {
  access?: string;
  refresh?: string;
  [key: string]: any; 
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

const authService = new AuthService();
export default authService;