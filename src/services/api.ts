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

      if (code === 'authorization_error') {
         localStorage.removeItem('access-token');
         localStorage.setItem('isAuthenticated', 'false');
         localStorage.setItem(
            'post-login-toast',
            JSON.stringify({
               type: 'error',
               message: 'Your session has expired. Please log in again.',
            })
         );
         window.location.href = '/login';
         return Promise.reject(error);
      }

      toast.error(message);

      return Promise.reject(error);
   }
);

export default api;
