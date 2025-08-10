import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
   baseURL: import.meta.env.VITE_API_URL,
   headers: {
      'Content-Type': 'application/json',
   },
   withCredentials: true,
});

api.interceptors.response.use(
   (response) => response,
   (error) => {
      const code = error.response?.data?.code;
      const message =
         error.response?.data?.message || error.message || 'Request failed';

      toast.error(message);

      if (code === 'authorization_error') {
         localStorage.removeItem('access-token');
         localStorage.setItem('isAuthenticated', 'false');
         toast.error('Your session has expired. Please log in again.');
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

   forgotPassword: async (email: string) => {
      const response = await api.post('/auth/password/forgot', { email });
      return response.data;
   },

   resetPassword: async (password: string, resetPasswordToken: string) => {
      const response = await api.post(
         `/auth/password/reset?resetPasswordToken=${encodeURIComponent(resetPasswordToken)}`,
         { password }
      );
      return response.data;
   },
};

export default api;
