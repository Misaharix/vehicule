import Link from 'next/link';
import { Demande } from '@/types';
import { Badge } from './Badge';

interface DemandeCardProps {
  demande: Demande;
  onCancel?: (id: number) => void;
}

/**
 * Card component for displaying a single vehicle request
 */
export function DemandeCard({ demande, onCancel }: DemandeCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition p-3 sm:p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-3 mb-4">
        <div className="min-w-0 flex-1">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{demande.destination}</h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">ID: {demande.id}</p>
        </div>
        <div className="flex-shrink-0">
          <Badge status={demande.status} />
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-4 text-xs sm:text-sm">
        <div>
          <p className="text-gray-500">Demandeur</p>
          <p className="font-medium text-gray-900 truncate">{demande.demandeur.nomComplet}</p>
        </div>
        <div>
          <p className="text-gray-500">Motif</p>
          <p className="font-medium text-gray-900 truncate">{demande.motif}</p>
        </div>
        <div>
          <p className="text-gray-500">Départ</p>
          <p className="font-medium text-gray-900">{formatDate(demande.dateDepart)}</p>
        </div>
        <div>
          <p className="text-gray-500">Retour</p>
          <p className="font-medium text-gray-900">{formatDate(demande.dateRetour)}</p>
        </div>
      </div>

      {/* Vehicle Assignment (if available) */}
      {demande.vehiculeAssigne && (
        <div className="mb-4 p-2 sm:p-3 bg-green-50 rounded-lg border border-green-100 text-xs sm:text-sm">
          <p className="text-xs text-green-600 font-medium mb-1">Véhicule assigné</p>
          <p className="font-medium text-gray-900 truncate">
            {demande.vehiculeAssigne.marque} {demande.vehiculeAssigne.modele} ({demande.vehiculeAssigne.immatriculation})
          </p>
          {demande.chauffeurAssigne && (
            <p className="text-xs sm:text-sm text-gray-600 mt-1 truncate">Chauffeur: {demande.chauffeurAssigne.nomComplet}</p>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-2">
        <Link
          href={`/demandes/${demande.id}`}
          className="flex-1 px-3 py-2 bg-[#1a5c38] text-white rounded-lg hover:bg-opacity-90 transition text-center text-xs sm:text-sm font-medium"
        >
          Voir détails
        </Link>
        {onCancel && (
          <button
            onClick={() => onCancel(demande.id)}
            className="px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition text-xs sm:text-sm font-medium"
          >
            Annuler
          </button>
        )}
      </div>
    </div>
  );
}
