'use client';

import { useState, FormEvent } from 'react';
import { Demande } from '@/types';

interface DemandeFormProps {
  onSubmit: (data: Partial<Demande>) => Promise<void>;
  initialData?: Partial<Demande>;
  isLoading?: boolean;
  error?: string;
}

/**
 * Form for creating or editing vehicle requests
 */
export function DemandeForm({ onSubmit, initialData, isLoading = false, error }: DemandeFormProps) {
  const [formData, setFormData] = useState({
    destination: initialData?.destination || '',
    motif: initialData?.motif || '',
    dateDepart: initialData?.dateDepart || '',
    dateRetour: initialData?.dateRetour || '',
    nombrePersonnes: initialData?.nombrePersonnes || 1,
    vehiculeRequete: initialData?.vehiculeRequete || '',
  });

  const [formError, setFormError] = useState<string | null>(error || null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'nombrePersonnes' ? parseInt(value) || 1 : value,
    }));
    setFormError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validate required fields
    if (!formData.destination || !formData.motif || !formData.dateDepart || !formData.dateRetour) {
      setFormError('Veuillez remplir tous les champs requis');
      return;
    }

    // Validate dates
    if (new Date(formData.dateDepart) >= new Date(formData.dateRetour)) {
      setFormError('La date de retour doit être après la date de départ');
      return;
    }

    try {
      await onSubmit(formData);
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

      {/* Destination */}
      <div>
        <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">
          Destination *
        </label>
        <input
          type="text"
          id="destination"
          name="destination"
          value={formData.destination}
          onChange={handleChange}
          placeholder="Ex: Paris, Lyon, Marseille"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5c38]"
        />
      </div>

      {/* Motif */}
      <div>
        <label htmlFor="motif" className="block text-sm font-medium text-gray-700 mb-1">
          Motif *
        </label>
        <textarea
          id="motif"
          name="motif"
          value={formData.motif}
          onChange={handleChange}
          placeholder="Décrivez le motif du déplacement"
          required
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5c38]"
        />
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="dateDepart" className="block text-sm font-medium text-gray-700 mb-1">
            Date de départ *
          </label>
          <input
            type="date"
            id="dateDepart"
            name="dateDepart"
            value={formData.dateDepart}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5c38]"
          />
        </div>
        <div>
          <label htmlFor="dateRetour" className="block text-sm font-medium text-gray-700 mb-1">
            Date de retour *
          </label>
          <input
            type="date"
            id="dateRetour"
            name="dateRetour"
            value={formData.dateRetour}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5c38]"
          />
        </div>
      </div>

      {/* Number of People */}
      <div>
        <label htmlFor="nombrePersonnes" className="block text-sm font-medium text-gray-700 mb-1">
          Nombre de personnes
        </label>
        <input
          type="number"
          id="nombrePersonnes"
          name="nombrePersonnes"
          value={formData.nombrePersonnes}
          onChange={handleChange}
          min="1"
          max="9"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5c38]"
        />
      </div>

      {/* Vehicle Request */}
      <div>
        <label htmlFor="vehiculeRequete" className="block text-sm font-medium text-gray-700 mb-1">
          Véhicule spécifique (optionnel)
        </label>
        <input
          type="text"
          id="vehiculeRequete"
          name="vehiculeRequete"
          value={formData.vehiculeRequete}
          onChange={handleChange}
          placeholder="Ex: Van, Bus, Voiture"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5c38]"
        />
      </div>

      {/* Submit Button */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 px-4 py-2 bg-[#1a5c38] text-white rounded-lg hover:bg-opacity-90 transition disabled:opacity-50 font-medium"
        >
          {isLoading ? 'Traitement...' : 'Soumettre la demande'}
        </button>
      </div>
    </form>
  );
}
