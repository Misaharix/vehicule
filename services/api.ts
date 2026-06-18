import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true,
});

// Intercepteur : Ajoute automatiquement le Token JWT à chaque requête HTTP
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token) {
        // Injection du token au format Bearer attendu par Django JWT
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Gestionnaire d'erreurs adapté à Django Rest Framework (DRF)
export const handleApiError = (error: any): string => {
  if (error.response) {
    // DRF envoie ses messages d'erreur dans le champ 'detail'
    return (
      error.response.data?.detail || 
      error.response.data?.message || 
      `Erreur ${error.response.status}`
    );
  }
  return error.message || 'Erreur réseau inconnue';
};

export default api;