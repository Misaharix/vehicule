"use client";
import { useState } from 'react';
import Image from 'next/image';
import { adminRegister } from '@/services/authService';

export default function RegisterAdminPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await adminRegister(username,password,email,nom,prenom);

      if (!response.success) {
        const errorMsg = response.message || Object.values(response).flat().join(', ') || "Une erreur est survenue.";
        throw new Error(errorMsg);
      }

      setSuccess("Administrateur créé avec succès !");
      setUsername('');
      setPassword('');
      setEmail('');
      setNom('');
      setPrenom('');
    } catch {
      setError("Connexion impossible pour le moment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ── Fond fixe : bulles vertes derrière tout ── */}
      <div className="fixed inset-0 -z-10 bg-[#eaeceb] overflow-hidden pointer-events-none">
        <div className="absolute top-[-8rem] left-1/2 -translate-x-1/2 h-[30rem] w-[30rem] rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute bottom-[-6rem] right-[-5rem] h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute bottom-[-4rem] left-[-4rem] h-52 w-52 rounded-full bg-[#0B7A5E]/10 blur-3xl" />
      </div>

      {/* ── Layout principal : scrollable, padding vertical ── */}
      <main className="min-h-screen flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-[440px]"> {/* Légèrement élargi pour les champs côte à côte */}
          {/* ── Carte ── */}
          <div className="overflow-hidden rounded-3xl bg-white shadow-[0_16px_56px_-12px_rgba(0,0,0,0.16),0_0_0_1px_rgba(16,185,129,0.12)]">
            {/* Ligne verte accent en haut */}
            <div className="h-[3px] bg-gradient-to-r from-emerald-300/40 via-emerald-500 to-emerald-300/40" />

            <div className="px-8 pt-8 pb-8">
              {/* ── Logo ── */}
              <div className="flex justify-center mb-5">
                <div className="relative flex h-[76px] w-[76px] items-center justify-center rounded-2xl bg-gradient-to-br from-white to-slate-50 shadow-md ring-1 ring-slate-200">
                  <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white" />
                  <Image
                    src="/ucp-sante-logo-color.png"
                    alt="Logo UCP"
                    width={62}
                    height={62}
                    className="object-contain"
                  />
                </div>
              </div>

              {/* ── En-tête ── */}
              <div className="text-center mb-7">
                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-emerald-700 mb-2">
                  Gestion des Véhicules
                </p>
                <h1 className="text-[26px] font-bold tracking-tight text-slate-900">
                  Nouvel Administrateur
                </h1>
                <div className="mt-3 mx-auto h-px w-12 bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />
              </div>

              {/* ── Notification Erreur ── */}
              {error && (
                <div className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {error}
                </div>
              )}

              {/* ── Notification Succès ── */}
              {success && (
                <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                  {success}
                </div>
              )}

              {/* ── Formulaire ── */}
              <form onSubmit={handleRegister} className="space-y-4">
                
                {/* Ligne : Nom & Prénom */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Nom
                    </label>
                    <input
                      type="text"
                      value={nom}
                      onChange={(e) => setNom(e.target.value)}
                      placeholder="Nom"
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Prénom
                    </label>
                    <input
                      type="text"
                      value={prenom}
                      onChange={(e) => setPrenom(e.target.value)}
                      placeholder="Prénom"
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Nom d utilisateur
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Ex: j.dupont"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Adresse Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="adresse@domaine.com"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                {/* Mot de passe */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Créer un mot de passe sécurisé"
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3 pr-11 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:text-emerald-600 transition"
                    >
                      {showPassword ? (
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Bouton de validation */}
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 w-full rounded-xl bg-[#1b5e30] py-3 text-sm font-semibold text-white shadow-[0_8px_24px_-6px_rgba(27,94,48,0.50)] transition hover:bg-[#14532d] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Création en cours..." : "Créer le compte"}
                </button>
              </form>

              {/* ── Footer ── */}
              <div className="mt-7 flex items-center justify-center gap-3 text-xs text-slate-400">
                <span className="h-px w-10 bg-gradient-to-r from-transparent to-emerald-300" />
                <span>Unité de Coordination des Projets</span>
                <span className="h-px w-10 bg-gradient-to-l from-transparent to-emerald-300" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}