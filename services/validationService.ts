import api, { handleApiError } from './api';
import { Validation, PaginatedResponse, ValidationStatut } from '@/types';

/**
 * Validation Service
 * Handles validation workflow submissions (Chef, Logistique, Directeur)
 */
class ValidationService {
  /**
   * Submit a validation (approval or rejection)
   */
  async submitValidation(
    demandeId: number,
    data: {
      statut: ValidationStatut;
      comments?: string;
      vehicule?: number; // For Logistique step
      chauffeur?: number; // For Logistique step
    }
  ): Promise<Validation> {
    try {
      const response = await api.post<Validation>(`/validations/`, {
        demande: demandeId,
        ...data,
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get all validations for current user
   */
  async getAll(params?: {
    page?: number;
    page_size?: number;
    step?: string;
    statut?: string;
  }): Promise<PaginatedResponse<Validation>> {
    try {
      const response = await api.get<PaginatedResponse<Validation>>('/validations/', {
        params,
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get a single validation
   */
  async getById(id: number): Promise<Validation> {
    try {
      const response = await api.get<Validation>(`/validations/${id}/`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get validations for a specific request
   */
  async getForRequest(demandeId: number): Promise<Validation[]> {
    try {
      const response = await api.get<PaginatedResponse<Validation>>('/validations/', {
        params: { demande: demandeId },
      });
      return response.data.results;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

export default new ValidationService();
