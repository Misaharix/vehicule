import { DemandeStatus, ValidationStatut } from '@/types';

interface BadgeProps {
  status: DemandeStatus | ValidationStatut | string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Status badge component for displaying request/validation status
 */
export function Badge({ status, size = 'md' }: BadgeProps) {
  const getStatusColor = (
    status: DemandeStatus | ValidationStatut | string
  ): {
    bg: string;
    text: string;
    label: string;
  } => {
    switch (status) {
      // Demande statuses
      case DemandeStatus.EN_ATTENTE_CHEF:
        return { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'En attente Chef' };
      case DemandeStatus.REJETEE_CHEF:
        return { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejetée (Chef)' };
      case DemandeStatus.EN_ATTENTE_LOGISTIQUE:
        return { bg: 'bg-blue-100', text: 'text-blue-800', label: 'En attente Logistique' };
      case DemandeStatus.REJETEE_LOGISTIQUE:
        return { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejetée (Logistique)' };
      case DemandeStatus.EN_ATTENTE_DIRECTEUR:
        return { bg: 'bg-purple-100', text: 'text-purple-800', label: 'En attente Directeur' };
      case DemandeStatus.REJETEE_DIRECTEUR:
        return { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejetée (Directeur)' };
      case DemandeStatus.APPROUVEE:
        return { bg: 'bg-green-100', text: 'text-green-800', label: 'Approuvée' };
      case DemandeStatus.ANNULEE:
        return { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Annulée' };

      // Validation statuses
      case ValidationStatut.APPROUVEE:
        return { bg: 'bg-green-100', text: 'text-green-800', label: 'Approuvée' };
      case ValidationStatut.REJETEE:
        return { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejetée' };
      case ValidationStatut.EN_ATTENTE:
        return { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'En attente' };

      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800', label: status };
    }
  };

  const { bg, text, label } = getStatusColor(status);

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${bg} ${text} ${sizeClasses[size]}`}
    >
      {label}
    </span>
  );
}
