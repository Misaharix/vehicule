import api, { handleApiError } from './api';
import { Demandeur, PaginatedResponse } from '@/types';

/**
 * Demandeur Service - Admin operations
 * CRUD operations for requester management
 */
class DemandeurService {
  /**
   * Get all demandeurs
   */
  async getAll(params?: {
    page?: number;
    page_size?: number;
    search?: string;
  }): Promise<PaginatedResponse<Demandeur>> {
    try {
      const response = await api.get<PaginatedResponse<Demandeur>>('/demandeurs/', {
        params,
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get a single demandeur
   */
  async getById(id: number): Promise<Demandeur> {
    try {
      const response = await api.get<Demandeur>(`/demandeurs/${id}/`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Create a new demandeur
   */
  async create(data: Partial<Demandeur>): Promise<Demandeur> {
    try {
      const response = await api.post<Demandeur>('/demandeurs/', data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Update a demandeur
   */
  async update(id: number, data: Partial<Demandeur>): Promise<Demandeur> {
    try {
      const response = await api.put<Demandeur>(`/demandeurs/${id}/`, data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Delete a demandeur
   */
  async delete(id: number): Promise<void> {
    try {
      await api.delete(`/demandeurs/${id}/`);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

export default new DemandeurService();
