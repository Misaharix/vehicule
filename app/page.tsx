import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#1a5c38] to-[#0d3d22] text-white p-6">
      
      <div className="max-w-2xl w-full text-center space-y-8">
        
        {/* Logo / Icône */}
        <div className="text-6xl sm:text-7xl animate-bounce-slow">
          🚗
        </div>

        {/* Titres */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
            Bienvenue sur <span className="text-[#3aaa35]">e-Car</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-200 font-medium max-w-lg mx-auto">
            Plateforme centralisée pour la gestion des demandes de véhicules.
          </p>
        </div>

        {/* Bouton de Connexion */}
        <div className="pt-8">
          <Link 
            href="/login" 
            className="inline-flex items-center justify-center px-8 py-3.5 bg-white text-[#1a5c38] font-bold text-lg rounded-full shadow-lg hover:bg-gray-100 hover:scale-105 transition-all duration-200"
          >
            Connexion
            <svg 
              className="ml-2 w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>

      </div>

      {/* Footer minimaliste */}
      <div className="absolute bottom-6 text-sm text-gray-400">
        © {new Date().getFullYear()} e-Car. Tous droits réservés.
      </div>
      
    </main>
  );
}