import axios from 'axios';

const api = axios.create({
   baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
   headers: {
      'Content-Type': 'application/json',
   },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
   const token = localStorage.getItem('token');
   if (token) {
      config.headers.Authorization = `Bearer ${token}`;
   }
   return config;
});

// Response interceptor to handle errors
api.interceptors.response.use(
   (response) => response,
   (error) => {
      if (error.response?.status === 401) {
         localStorage.removeItem('token');
         window.location.href = '/login';
      }
      return Promise.reject(error);
   }
);

export const authAPI = {
   login: async (email: string, password: string) => {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.token) {
         localStorage.setItem('token', response.data.token);
      }
      return response.data;
   },

   register: async (email: string, password: string) => {
      const response = await api.post('/auth/register', { email, password });
      if (response.data.token) {
         localStorage.setItem('token', response.data.token);
      }
      return response.data;
   },

   logout: () => {
      localStorage.removeItem('token');
   },
};

export default api;
