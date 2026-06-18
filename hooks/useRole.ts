'use client';

import { useAuth } from './useAuth';
import { UserRole, ValidationStep } from '@/types';

interface RolePermissions {
  canCreateDemande: boolean;
  canValidateAsChef: boolean;
  canValidateAsLogistique: boolean;
  canValidateAsDirecteur: boolean;
  canAccessAdmin: boolean;
  canManageDemandeurs: boolean;
  canManageVehicules: boolean;
  canManageChauffeurs: boolean;
}

/**
 * Hook for role-based access control
 */
export function useRole() {
  const { userRole, isAdminAuthenticated } = useAuth();

  const hasRole = (role: UserRole): boolean => {
    return userRole === role;
  };

  const hasAnyRole = (...roles: UserRole[]): boolean => {
    return roles.includes(userRole || UserRole.DEMANDEUR);
  };

  const canValidate = (): boolean => {
    return [UserRole.CHEF, UserRole.LOGISTIQUE, UserRole.DIRECTEUR].includes(
      userRole || UserRole.DEMANDEUR
    );
  };

  const canAssignVehicle = (): boolean => {
    return userRole === UserRole.LOGISTIQUE;
  };

  const getValidationStep = (): ValidationStep | null => {
    switch (userRole) {
      case UserRole.CHEF:
        return ValidationStep.CHEF;
      case UserRole.LOGISTIQUE:
        return ValidationStep.LOGISTIQUE;
      case UserRole.DIRECTEUR:
        return ValidationStep.DIRECTEUR;
      default:
        return null;
    }
  };

  const getPermissions = (): RolePermissions => {
    return {
      canCreateDemande: userRole === UserRole.DEMANDEUR,
      canValidateAsChef: userRole === UserRole.CHEF,
      canValidateAsLogistique: userRole === UserRole.LOGISTIQUE,
      canValidateAsDirecteur: userRole === UserRole.DIRECTEUR,
      canAccessAdmin: isAdminAuthenticated,
      canManageDemandeurs: isAdminAuthenticated,
      canManageVehicules: isAdminAuthenticated,
      canManageChauffeurs: isAdminAuthenticated,
    };
  };

  return {
    userRole,
    hasRole,
    hasAnyRole,
    canValidate,
    canAssignVehicle,
    getValidationStep,
    getPermissions,
    isAdmin: isAdminAuthenticated,
  };
}
