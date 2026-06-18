'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { login, adminLogin, isLoading, error } = useAuth();
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [localError, setLocalError] = useState<string | null>(null);
  
  // Anti-Hydration Mismatch : On s'assure que le composant est bien monté côté client
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Si le client n'est pas hydraté, on force le mode chargement à 'false' pour correspondre au serveur
  const effectivelyLoading = isHydrated && isLoading;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setLocalError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!formData.email || !formData.password) {
      setLocalError('Veuillez entrer votre email et mot de passe');
      return;
    }

    try {
      if (isAdminLogin) {
        await adminLogin(formData.email, formData.password);
        router.push('/admin/dashboard');
      } else {
        await login(formData.email, formData.password);
        router.push('/dashboard');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur de connexion';
      setLocalError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a5c38] to-[#0d3d22] flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">🚗</div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">UCP Santé</h1>
          <p className="text-[#3aaa35] text-xs sm:text-sm">Gestion des demandes de véhicules</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8">
          {/* Tab Selection */}
          <div className="flex gap-2 mb-6 border-b border-gray-200">
            <button
              onClick={() => setIsAdminLogin(false)}
              className={`flex-1 pb-2 text-xs sm:text-sm font-medium transition ${
                !isAdminLogin
                  ? 'border-b-2 border-[#1a5c38] text-[#1a5c38]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Utilisateur
            </button>
            <button
              onClick={() => setIsAdminLogin(true)}
              className={`flex-1 pb-2 text-xs sm:text-sm font-medium transition ${
                isAdminLogin
                  ? 'border-b-2 border-[#1a5c38] text-[#1a5c38]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Admin
            </button>
          </div>

          {/* Error Alert */}
          {(localError || error) && (
            <div className="mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-xs sm:text-sm">{localError || error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="votre@email.com"
                disabled={effectivelyLoading}
                className="w-full px-3 sm:px-4 py-2 text-sm bg-white text-gray-900 placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5c38] disabled:opacity-50"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Mot de passe
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                disabled={effectivelyLoading}
                className="w-full px-3 sm:px-4 py-2 text-sm bg-white text-gray-900 placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5c38] disabled:opacity-50"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={effectivelyLoading}
              className="w-full py-2 bg-[#1a5c38] text-white text-sm sm:text-base rounded-lg hover:bg-opacity-90 transition font-medium disabled:opacity-50"
            >
              {effectivelyLoading ? 'Connexion en cours...' : 'Se connecter'}
            </button>
          </form>

          {/* Info Text */}
          <p className="text-xs text-gray-500 text-center mt-4">
            {isAdminLogin
              ? 'Connectez-vous avec vos identifiants administrateur'
              : 'Connectez-vous avec vos identifiants utilisateur'}
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-300 text-xs mt-6">
          © 2026 UCP Santé. Tous droits réservés.
        </p>
      </div>
    </div>
  );
}