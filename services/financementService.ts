import axios from 'axios'; // Ou utilise ton instance axios personnalisée/fetch si tu en as une

// Si tu as déjà un fichier axios configuré (ex: api.ts ou client.ts), 
// importe-le plutôt que d'utiliser axios directement pour garder tes interceptors JWT.

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const financementService = {
  // Récupérer tous les financements pour la liste déroulante
  getAll: async () => {
    try {
      // Récupération du token depuis le localStorage ou les cookies (adapte selon ton useAuth)
      const token = localStorage.getItem('token'); 
      
      const response = await axios.get(`${API_URL}/api/admin/financements/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur financementService.getAll:', error);
      throw error;
    }
  }
};

export default financementService;