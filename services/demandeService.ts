import api, { handleApiError } from './api';
import { Demande, PaginatedResponse } from '@/types';

/**
 * Demande (Vehicle Request) Service
 * Handles CRUD operations for vehicle requests
 */
class DemandeService {
  /**
   * Create a new vehicle request
   */
  async create(data: Partial<Demande>): Promise<Demande> {
    try {
      const response = await api.post<Demande>('/demandes/', data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get all requests for current user (demandeur, chef validating, etc.)
   */
  async getAll(params?: {
    status?: string;
    page?: number;
    page_size?: number;
    search?: string;
  }): Promise<PaginatedResponse<Demande>> {
    try {
      const response = await api.get<PaginatedResponse<Demande>>('/demandes/', {
        params,
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get a single request by ID
   */
  async getById(id: number): Promise<Demande> {
    try {
      const response = await api.get<Demande>(`/demandes/${id}/`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Update a request (typically only owner/creator can update)
   */
  async update(id: number, data: Partial<Demande>): Promise<Demande> {
    try {
      const response = await api.put<Demande>(`/demandes/${id}/`, data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Cancel a request (change status to ANNULEE)
   */
  async cancel(id: number): Promise<Demande> {
    try {
      const response = await api.post<Demande>(`/demandes/${id}/cancel/`, {});
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get pending requests for current validator role
   */
  async getPending(params?: {
    page?: number;
    page_size?: number;
  }): Promise<PaginatedResponse<Demande>> {
    try {
      const response = await api.get<PaginatedResponse<Demande>>('/demandes/pending/', {
        params,
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

export default new DemandeService();
