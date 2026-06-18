import api, { handleApiError } from './api';
import { User, Admin, AuthResponse, AdminAuthResponse } from '@/types';

class AuthService {
  getAll(arg0: { page_size: number; }): any {
    throw new Error('Method not implemented.');
  }
  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await api.get<AuthResponse>('/auth/me/');
      return response.data.user || null;
    } catch (error: any) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        return null;
      }
      console.error('Erreur getCurrentUser:', handleApiError(error));
      return null;
    }
  }

  async getCurrentAdmin(): Promise<Admin | null> {
    try {
      const response = await api.get<AdminAuthResponse>('/auth/admin/me/');
      return response.data.admin || null;
    } catch (error: any) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        return null;
      }
      console.error('Erreur getCurrentAdmin:', handleApiError(error));
      return null;
    }
  }

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout/');
    } catch (error) {
      console.error('Logout error:', handleApiError(error));
    }
  }
}

// Instance unique exportée
const authService = new AuthService();
export default authService;