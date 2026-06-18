import api, { handleApiError } from './api';
import { Vehicule, PaginatedResponse } from '@/types';

/**
 * Vehicule Service - Admin operations
 * CRUD operations for vehicle management
 */
class VehiculeService {
  /**
   * Get all vehicles
   */
  async getAll(params?: {
    page?: number;
    page_size?: number;
    disponible?: boolean;
    search?: string;
  }): Promise<PaginatedResponse<Vehicule>> {
    try {
      const response = await api.get<PaginatedResponse<Vehicule>>('/vehicules/', {
        params,
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get a single vehicle
   */
  async getById(id: number): Promise<Vehicule> {
    try {
      const response = await api.get<Vehicule>(`/vehicules/${id}/`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Create a new vehicle
   */
  async create(data: Partial<Vehicule>): Promise<Vehicule> {
    try {
      const response = await api.post<Vehicule>('/vehicules/', data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Update a vehicle
   */
  async update(id: number, data: Partial<Vehicule>): Promise<Vehicule> {
    try {
      const response = await api.put<Vehicule>(`/vehicules/${id}/`, data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Delete a vehicle
   */
  async delete(id: number): Promise<void> {
    try {
      await api.delete(`/vehicules/${id}/`);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

export default new VehiculeService();
