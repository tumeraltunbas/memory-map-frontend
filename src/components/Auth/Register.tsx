import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { setUser } from '../../stores/slices/userSlice';
import { authAPI } from '../../services/api';
import { AuthLayout } from '../AuthLayout';

export const Register = () => {
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [confirmPassword, setConfirmPassword] = useState('');
   const [error, setError] = useState('');

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');

      if (password !== confirmPassword) {
         setError('Passwords do not match');
         return;
      }

      try {
         await authAPI.register(email, password);

         // Get user details after successful registration
         const userData = await authAPI.getCurrentUser();
         dispatch(setUser(userData));

         navigate('/map');
      } catch (err) {
         setError('Failed to create account. Please try again.');
      }
   };

   return (
      <AuthLayout
         title="Create your account"
         subtitle="Start mapping your memories today"
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
                     autoComplete="new-password"
                     required
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#9E7B9B] focus:border-[#9E7B9B] sm:text-sm"
                  />
               </div>
            </div>

            <div>
               <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
               >
                  Confirm Password
               </label>
               <div className="mt-1">
                  <input
                     id="confirmPassword"
                     name="confirmPassword"
                     type="password"
                     autoComplete="new-password"
                     required
                     value={confirmPassword}
                     onChange={(e) => setConfirmPassword(e.target.value)}
                     className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#9E7B9B] focus:border-[#9E7B9B] sm:text-sm"
                  />
               </div>
            </div>

            <div>
               <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#9E7B9B] hover:bg-[#8B6B8B] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#9E7B9B]"
               >
                  Create Account
               </button>
            </div>

            <div className="text-sm text-center">
               <span className="text-gray-500">Already have an account?</span>{' '}
               <Link
                  to="/login"
                  className="font-medium text-[#9E7B9B] hover:text-[#8B6B8B]"
               >
                  Sign in
               </Link>
            </div>
         </form>
      </AuthLayout>
   );
};
