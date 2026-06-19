/**
 * User & Admin types
 */
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  departement?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Admin {
  id: number;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * User Roles
 */
export enum UserRole {
  DEMANDEUR = 'demandeur',
  CHEF = 'chef',
  LOGISTIQUE = 'logistique',
  DIRECTEUR = 'directeur',
  ADMIN = 'admin',
}

/**
 * Demande (Vehicle Request) - Main workflow entity
 */
export interface Demande {
  id: number;
  demandeur: Demandeur;
  motif: string;
  dateDepart: string;
  dateRetour: string;
  destination: string;
  nombrePersonnes: number;
  vehiculeRequete?: string; // Specific vehicle request by demandeur
  status: DemandeStatus;
  validationChef?: Validation;
  validationLogistique?: Validation;
  validationDirecteur?: Validation;
  vehiculeAssigne?: Vehicule;
  chauffeurAssigne?: Chauffeur;
  createdAt: string;
  updatedAt: string;
}

export enum DemandeStatus {
  EN_ATTENTE_CHEF = 'en_attente_chef',
  REJETEE_CHEF = 'rejetee_chef',
  EN_ATTENTE_LOGISTIQUE = 'en_attente_logistique',
  REJETEE_LOGISTIQUE = 'rejetee_logistique',
  EN_ATTENTE_DIRECTEUR = 'en_attente_directeur',
  REJETEE_DIRECTEUR = 'rejetee_directeur',
  APPROUVEE = 'approuvee',
  ANNULEE = 'annulee',
}

/**
 * Validation - Step in workflow
 */
export interface Validation {
  id: number;
  demande: number;
  validateur: User;
  step: ValidationStep;
  statut: ValidationStatut;
  comments?: string;
  vehicule?: Vehicule;
  chauffeur?: Chauffeur;
  createdAt: string;
  updatedAt: string;
}

export enum ValidationStep {
  CHEF = 'chef',
  LOGISTIQUE = 'logistique',
  DIRECTEUR = 'directeur',
}

export enum ValidationStatut {
  APPROUVEE = 'approuvee',
  REJETEE = 'rejetee',
  EN_ATTENTE = 'en_attente',
}

/**
 * Demandeur - Request originator
 */
export interface Demandeur {
  id: number;
  nom: string;
  email: string;
  numeroTelephone: string;
  departement: string;
  poste: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Vehicule - Vehicle in fleet
 */
export interface Vehicule {
  id: number;
  marque: string;
  modele: string;
  immatriculation: string;
  nombrePlaces: number;
  carburant: string;
  disponible: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Chauffeur - Driver
 */
export interface Chauffeur {
  id: number;
  nom: string;
  prenom : string;
  telephone: string;
  disponible: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * API Response wrappers
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

/**
 * Auth response
 */
export interface AuthResponse {
  user: User;
  message: string;
}

export interface AdminAuthResponse {
  admin: Admin;
  message: string;
}

/**
 * Helper types for UI
 */
export interface DashboardStats {
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  totalRequests: number;
}

export interface ValidationWorkflow {
  step: ValidationStep;
  status: 'completed' | 'pending' | 'rejected';
  validatedBy?: User;
  validatedAt?: string;
  comment?: string;
}

export type DemandeWithWorkflow = Demande & {
  workflow: ValidationWorkflow[];
  currentStep: ValidationStep | null;
  canValidate: boolean;
};
