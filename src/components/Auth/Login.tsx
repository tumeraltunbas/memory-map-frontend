import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { setUser } from '../../stores/slices/userSlice';
import { authAPI } from '../../services/api';
import { AuthLayout } from '../AuthLayout';

export const Login = () => {
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [error, setError] = useState('');

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');

      try {
         await authAPI.login(email, password);

         // Get user details after successful login
         const userData = await authAPI.getCurrentUser();
         dispatch(setUser(userData));

         navigate('/map');
      } catch (err) {
         setError('Invalid email or password');
      }
   };

   return (
      <AuthLayout
         title="Welcome back"
         subtitle="Sign in to your account to continue"
      >
         <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
               <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                  {error}
               </div>
            )}

            <div>
               <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
               >
                  Email address
               </label>
               <div className="mt-1">
                  <input
                     id="email"
                     name="email"
                     type="email"
                     autoComplete="email"
                     required
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#9E7B9B] focus:border-[#9E7B9B] sm:text-sm"
                  />
               </div>
            </div>

            <div>
               <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
               >
                  Password
               </label>
               <div className="mt-1">
                  <input
                     id="password"
                     name="password"
                     type="password"
                     autoComplete="current-password"
                     required
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#9E7B9B] focus:border-[#9E7B9B] sm:text-sm"
                  />
               </div>
            </div>

            <div className="flex items-center justify-between">
               <div className="text-sm">
                  <Link
                     to="/forgot-password"
                     className="font-medium text-[#9E7B9B] hover:text-[#8B6B8B]"
                  >
                     Forgot your password?
                  </Link>
               </div>
            </div>

            <div>
               <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#9E7B9B] hover:bg-[#8B6B8B] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#9E7B9B]"
               >
                  Sign in
               </button>
            </div>

            <div className="text-sm text-center">
               <span className="text-gray-500">Don't have an account?</span>{' '}
               <Link
                  to="/register"
                  className="font-medium text-[#9E7B9B] hover:text-[#8B6B8B]"
               >
                  Sign up
               </Link>
            </div>
         </form>
      </AuthLayout>
   );
};
