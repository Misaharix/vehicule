import api, { handleApiError } from './api';
import { Chauffeur, PaginatedResponse } from '@/types';

class ChauffeurService {
  async getAll(params?: {
    page?: number;
    page_size?: number;
    search?: string;
  }): Promise<PaginatedResponse<Chauffeur>> {
    try {
      const response = await api.get('/admin/chauffeurs/', { params });
      const data = response.data;
      // Adapter si le backend retourne un tableau simple
      if (Array.isArray(data)) {
        return { results: data, count: data.length };
      }
      return data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async getById(id: number): Promise<Chauffeur> {
    try {
      const response = await api.get<Chauffeur>(`/admin/chauffeurs/${id}/`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async create(data: Partial<Chauffeur>): Promise<Chauffeur> {
    try {
      const response = await api.post<Chauffeur>('/admin/chauffeurs/', data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async update(id: number, data: Partial<Chauffeur>): Promise<Chauffeur> {
    try {
      const response = await api.put<Chauffeur>(`/admin/chauffeurs/${id}/`, data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await api.delete(`/admin/chauffeurs/${id}/`);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

export default new ChauffeurService();