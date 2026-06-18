'use client';

import { useState, FormEvent, useEffect } from 'react';
import { Demande, ValidationStatut, Vehicule, Chauffeur, ValidationStep } from '@/types';
import { useRole } from '@/hooks/useRole';
import vehiculeService from '@/services/vehiculeService';
import chauffeurService from '@/services/chauffeurService';

interface ValidationFormProps {
  demande: Demande;
  onSubmit: (data: {
    statut: ValidationStatut;
    comments?: string;
    vehicule?: number;
    chauffeur?: number;
  }) => Promise<void>;
  isLoading?: boolean;
  error?: string;
}

/**
 * Form for validators to approve/reject requests with role-specific fields
 */
export function ValidationForm({ demande, onSubmit, isLoading = false, error }: ValidationFormProps) {
  const { getValidationStep, canAssignVehicle } = useRole();
  const validationStep = getValidationStep();

  const [formData, setFormData] = useState({
    statut: ValidationStatut.APPROUVEE as ValidationStatut,
    comments: '',
    vehicule: '',
    chauffeur: '',
  });

  const [formError, setFormError] = useState<string | null>(error || null);
  const [vehicules, setVehicules] = useState<Vehicule[]>([]);
  const [chauffeurs, setChauffeurs] = useState<Chauffeur[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  // Load vehicles and drivers for Logistique role
  useEffect(() => {
    if (canAssignVehicle()) {
      loadOptions();
    }
  }, [canAssignVehicle]);

  const loadOptions = async () => {
    try {
      setLoadingOptions(true);
      const [vehiculesResponse, chauffeursResponse] = await Promise.all([
        vehiculeService.getAll({ disponible: true }),
        chauffeurService.getAll({ disponible: true }),
      ]);
      setVehicules(vehiculesResponse.results);
      setChauffeurs(chauffeursResponse.results);
    } catch (err) {
      console.error('Error loading options:', err);
    } finally {
      setLoadingOptions(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Logistique must assign vehicle and driver
    if (canAssignVehicle() && formData.statut === ValidationStatut.APPROUVEE) {
      if (!formData.vehicule || !formData.chauffeur) {
        setFormError('Veuillez sélectionner un véhicule et un chauffeur');
        return;
      }
    }

    try {
      await onSubmit({
        statut: formData.statut,
        comments: formData.comments,
        vehicule: formData.vehicule ? parseInt(formData.vehicule) : undefined,
        chauffeur: formData.chauffeur ? parseInt(formData.chauffeur) : undefined,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      setFormError(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Error Alert */}
      {formError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm font-medium">{formError}</p>
        </div>
      )}

      {/* Request Summary */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Demandeur</p>
            <p className="font-medium text-gray-900">{demande.demandeur.nomComplet}</p>
          </div>
          <div>
            <p className="text-gray-500">Destination</p>
            <p className="font-medium text-gray-900">{demande.destination}</p>
          </div>
          <div>
            <p className="text-gray-500">Motif</p>
            <p className="font-medium text-gray-900">{demande.motif}</p>
          </div>
          <div>
            <p className="text-gray-500">Nombre de personnes</p>
            <p className="font-medium text-gray-900">{demande.nombrePersonnes}</p>
          </div>
        </div>
      </div>

      {/* Validation Decision */}
      <div>
        <label htmlFor="statut" className="block text-sm font-medium text-gray-700 mb-1">
          Décision *
        </label>
        <select
          id="statut"
          name="statut"
          value={formData.statut}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5c38]"
        >
          <option value={ValidationStatut.APPROUVEE}>Approuver</option>
          <option value={ValidationStatut.REJETEE}>Rejeter</option>
        </select>
      </div>

      {/* Vehicle Selection (for Logistique only) */}
      {canAssignVehicle() && (
        <>
          <div>
            <label htmlFor="vehicule" className="block text-sm font-medium text-gray-700 mb-1">
              Véhicule {formData.statut === ValidationStatut.APPROUVEE ? '*' : ''}
            </label>
            <select
              id="vehicule"
              name="vehicule"
              value={formData.vehicule}
              onChange={handleChange}
              disabled={loadingOptions || formData.statut === ValidationStatut.REJETEE}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5c38] disabled:opacity-50"
            >
              <option value="">Sélectionner un véhicule</option>
              {vehicules.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.marque} {v.modele} ({v.immatriculation})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="chauffeur" className="block text-sm font-medium text-gray-700 mb-1">
              Chauffeur {formData.statut === ValidationStatut.APPROUVEE ? '*' : ''}
            </label>
            <select
              id="chauffeur"
              name="chauffeur"
              value={formData.chauffeur}
              onChange={handleChange}
              disabled={loadingOptions || formData.statut === ValidationStatut.REJETEE}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5c38] disabled:opacity-50"
            >
              <option value="">Sélectionner un chauffeur</option>
              {chauffeurs.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nomComplet}
                </option>
              ))}
            </select>
          </div>
        </>
      )}

      {/* Comments */}
      <div>
        <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-1">
          Commentaires
        </label>
        <textarea
          id="comments"
          name="comments"
          value={formData.comments}
          onChange={handleChange}
          placeholder="Ajouter un commentaire (optionnel)"
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5c38]"
        />
      </div>

      {/* Submit Button */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isLoading || loadingOptions}
          className={`flex-1 px-4 py-2 rounded-lg transition font-medium text-white ${
            formData.statut === ValidationStatut.APPROUVEE
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-red-600 hover:bg-red-700'
          } disabled:opacity-50`}
        >
          {isLoading ? 'Traitement...' : formData.statut === ValidationStatut.APPROUVEE ? 'Approuver' : 'Rejeter'}
        </button>
      </div>
    </form>
  );
}
