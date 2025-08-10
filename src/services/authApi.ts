import api from './api';
import type { UserProfileResponse } from '../types';

export const authAPI = {
   login: async (email: string, password: string): Promise<any> => {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
   },

   register: async (email: string, password: string): Promise<any> => {
      const response = await api.post('/auth/register', { email, password });
      return response.data;
   },

   logout: () => {
      localStorage.removeItem('isAuthenticated');
   },

   getCurrentUser: async (): Promise<any> => {
      const response = await api.get('/users');
      return response.data;
   },

   changePassword: async (
      currentPassword: string,
      newPassword: string
   ): Promise<any> => {
      const response = await api.patch('/auth/password', {
         currentPassword,
         newPassword,
      });
      return response.data;
   },

   profile: async (): Promise<UserProfileResponse> => {
      const response = await api.get('/users/profile');
      return response.data;
   },

   forgotPassword: async (email: string): Promise<any> => {
      const response = await api.post('/auth/password/forgot', { email });
      return response.data;
   },

   resetPassword: async (
      password: string,
      resetPasswordToken: string
   ): Promise<any> => {
      const response = await api.post(
         `/auth/password/reset?resetPasswordToken=${encodeURIComponent(resetPasswordToken)}`,
         { password }
      );
      return response.data;
   },
};
