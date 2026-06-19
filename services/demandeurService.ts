import api, { handleApiError } from './api';
import { Demandeur, PaginatedResponse } from '@/types';

class DemandeurService {
  async getAll(params?: {
    page?: number;
    page_size?: number;
    search?: string;
  }): Promise<PaginatedResponse<Demandeur>> {
    try {
      const response = await api.get<PaginatedResponse<Demandeur>>('/admin/demandeurs/', { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async getById(id: number): Promise<Demandeur> {
    try {
      const response = await api.get<Demandeur>(`/admin/demandeurs/${id}/`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async create(data: Partial<Demandeur>): Promise<Demandeur> {
    try {
      const response = await api.post<Demandeur>('/admin/demandeurs/', data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async update(id: number, data: Partial<Demandeur>): Promise<Demandeur> {
    try {
      const response = await api.put<Demandeur>(`/admin/demandeurs/${id}/`, data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await api.delete(`/admin/demandeurs/${id}/`);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

export default new DemandeurService();