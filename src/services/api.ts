import axios from 'axios';

const api = axios.create({
   baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
   headers: {
      'Content-Type': 'application/json',
   },
   withCredentials: true,
});

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

export type UserProfileResponse = {
   user: {
      userId: string;
      email: string;
      createdAt: Date;
   };
   totalMarkdownCount: number;
   totalCountryCount: number;
   totalCityCount: number;
};

export const authAPI = {
   login: async (email: string, password: string) => {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
   },

   register: async (email: string, password: string) => {
      const response = await api.post('/auth/register', { email, password });
      return response.data;
   },

   logout: () => {
      localStorage.removeItem('isAuthenticated');
   },

   getCurrentUser: async () => {
      const response = await api.get('/users');
      return response.data;
   },

   changePassword: async (currentPassword: string, newPassword: string) => {
      const response = await api.patch('/auth/password', {
         currentPassword,
         newPassword,
      });
      return response.data;
   },

   profile: async () => {
      const response = await api.get('/users/profile');
      return response.data;
   },
};

export default api;
