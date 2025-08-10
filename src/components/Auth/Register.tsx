import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { setUser } from '../../stores/slices/userSlice';
import { authAPI } from '../../services/authApi';
import { AuthLayout } from '../AuthLayout';

export const Register = () => {
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');

   const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
   const isPasswordValid = passwordRegex.test(password);

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!isPasswordValid) return;

      try {
         await authAPI.register(email, password);

         // Get user details after successful registration
         const userData = await authAPI.getCurrentUser();
         dispatch(setUser(userData));

         navigate('/map');
      } catch (err) {}
   };

   return (
      <AuthLayout
         title="Create your account"
         subtitle="Start mapping your memories today"
      >
         <form className="space-y-6" onSubmit={handleSubmit}>
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
                     className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm ${
                        password && !isPasswordValid
                           ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                           : 'border-gray-300 focus:ring-[#9E7B9B] focus:border-[#9E7B9B]'
                     }`}
                  />
               </div>
               {password && !isPasswordValid && (
                  <p className="mt-1 text-xs text-red-600">
                     Must be at least 8 characters, include uppercase, lowercase
                     and a number.
                  </p>
               )}
            </div>

            <div>
               <button
                  type="submit"
                  disabled={!isPasswordValid}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                     !isPasswordValid
                        ? 'bg-[#9E7B9B]/60 cursor-not-allowed'
                        : 'bg-[#9E7B9B] hover:bg-[#8B6B8B] focus:ring-[#9E7B9B]'
                  }`}
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
