import { Demande, DemandeStatus } from '@/types';

interface DemandeProgressionProps {
  demande: Demande;
}

/**
 * Visual workflow progression showing the 4 steps of validation
 * Chef → Logistique → Directeur → Terminé
 */
export function DemandeProgression({ demande }: DemandeProgressionProps) {
  const steps = [
    { label: 'Chef', step: 'chef' },
    { label: 'Logistique', step: 'logistique' },
    { label: 'Directeur', step: 'directeur' },
    { label: 'Terminé', step: 'termine' },
  ];

  const getStepStatus = (step: string) => {
    switch (step) {
      case 'chef':
        if (demande.validationChef) {
          return demande.validationChef.statut === 'approuvee' ? 'completed' : 'rejected';
        }
        return demande.status === DemandeStatus.EN_ATTENTE_CHEF ? 'pending' : 'upcoming';

      case 'logistique':
        if (demande.validationLogistique) {
          return demande.validationLogistique.statut === 'approuvee' ? 'completed' : 'rejected';
        }
        return demande.status === DemandeStatus.EN_ATTENTE_LOGISTIQUE ? 'pending' : 'upcoming';

      case 'directeur':
        if (demande.validationDirecteur) {
          return demande.validationDirecteur.statut === 'approuvee' ? 'completed' : 'rejected';
        }
        return demande.status === DemandeStatus.EN_ATTENTE_DIRECTEUR ? 'pending' : 'upcoming';

      case 'termine':
        return demande.status === DemandeStatus.APPROUVEE ? 'completed' : 'upcoming';

      default:
        return 'upcoming';
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const status = getStepStatus(step.step);
          const isLast = index === steps.length - 1;

          return (
            <div key={step.step} className="flex items-center flex-1">
              {/* Step Circle */}
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm ${
                  status === 'completed'
                    ? 'bg-[#3aaa35] text-white'
                    : status === 'pending'
                      ? 'bg-yellow-400 text-white'
                      : status === 'rejected'
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                }`}
              >
                {status === 'completed' ? '✓' : status === 'rejected' ? '✗' : index + 1}
              </div>

              {/* Step Label */}
              <div className="ml-2">
                <p className="text-sm font-medium text-gray-900">{step.label}</p>
              </div>

              {/* Connector Line */}
              {!isLast && (
                <div
                  className={`flex-1 h-1 ml-2 ${
                    getStepStatus(steps[index + 1].step) === 'completed' ||
                    getStepStatus(steps[index + 1].step) === 'rejected'
                      ? 'bg-[#3aaa35]'
                      : 'bg-gray-300'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Status Details */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          <span className="font-medium">Statut actuel:</span> {demande.status.replace(/_/g, ' ')}
        </p>
      </div>
    </div>
  );
}
