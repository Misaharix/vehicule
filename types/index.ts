export type Role = 'Demandeur' | 'Chef' | 'Logistique' | 'Directeur'
export type StatutDemande = 'en_attente' | 'approuvee' | 'rejetee'
export type EtapeDemande = 'chef' | 'logistique' | 'directeur' | 'termine'
export type MotifDemande = 'mission' | 'transport' | 'deplacement' | 'autre'

export enum UserRole {
  DEMANDEUR = 'Demandeur',
  CHEF = 'Chef',
  LOGISTIQUE = 'Logistique',
  DIRECTEUR = 'Directeur',
}

export interface User {
  id: number
  username: string
  first_name: string
  last_name: string
  email: string
  role: Role
  poste: string
  service: string
  telephone: string
  chef_direct: number | null
  chef_direct_nom: string | null
  is_active: boolean
}

export interface Admin {
  id: number
  username: string
  email: string
  nom: string
  prenom: string
  is_active: boolean
}

export interface Vehicule {
  id: number
  immatriculation: string
  marque: string
  modele: string
  disponible: boolean
}

export interface Chauffeur {
  id: number
  nom: string
  prenom: string
  telephone: string
  email: string
  disponible: boolean
  date_creation: string
}

export interface Financement {
  id: number
  nom: string
}

export interface ValidationDemande {
  id: number
  demande: number
  validateur: number
  validateur_nom: string
  etape: string
  etape_display: string
  decision: 'approuve' | 'rejete'
  decision_display: string
  commentaire: string
  date_validation: string
}

export interface DemandeVehicule {
  id: number
  demandeur: number
  demandeur_nom: string
  demandeur_poste: string
  demandeur_email: string
  chef_direct_nom: string | null
  vehicule: number | null
  vehicule_info: Vehicule | null
  chauffeur: number | null
  chauffeur_info: Chauffeur | null
  motif: MotifDemande
  destination: string
  description: string
  date_depart: string
  date_retour: string
  nombre_passagers: number
  statut: StatutDemande
  statut_display: string
  etape_validation: EtapeDemande
  etape_display: string
  validations: ValidationDemande[]
  date_creation: string
  date_modification: string
}