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
   const [showPassword, setShowPassword] = useState<boolean>(false);
   const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

   const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
   const isPasswordValid = passwordRegex.test(password);

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!isPasswordValid) return;

      try {
         setIsSubmitting(true);
         await authAPI.register(email, password);

         // Get user details after successful registration
         const userData = await authAPI.getCurrentUser();
         dispatch(setUser(userData));

         navigate('/map');
      } catch (err) {
         setIsSubmitting(false);
      }
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
                     className="appearance-none block w-full h-11 px-3 border border-gray-300 rounded-md shadow-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-[#9E7B9B] focus:border-[#9E7B9B] sm:text-sm"
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
               <div className="mt-1 relative">
                  <input
                     id="password"
                     name="password"
                     type={showPassword ? 'text' : 'password'}
                     autoComplete="new-password"
                     required
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     className={`appearance-none block w-full h-11 pl-3 pr-10 border rounded-md shadow-sm bg-white placeholder-gray-400 focus:outline-none sm:text-sm [caret-color:#4A5568] ${
                        password && !isPasswordValid
                           ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                           : 'border-gray-300 focus:ring-[#9E7B9B] focus:border-[#9E7B9B]'
                     }`}
                     inputMode="text"
                  />
                  <button
                     type="button"
                     onClick={() => setShowPassword((v) => !v)}
                     className="absolute inset-y-0 right-2 my-auto p-2 text-gray-400 hover:text-gray-600 rounded focus:outline-none cursor-pointer"
                     aria-label={
                        showPassword ? 'Hide password' : 'Show password'
                     }
                     aria-pressed={showPassword}
                  >
                     {showPassword ? (
                        <svg
                           className="w-5 h-5"
                           viewBox="0 0 24 24"
                           fill="none"
                           stroke="currentColor"
                        >
                           <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13.875 18.825A10.05 10.05 0 0 1 12 19c-7 0-10-7-10-7a18.836 18.836 0 0 1 5.058-5.943m3.14-1.57A9.966 9.966 0 0 1 12 5c7 0 10 7 10 7a18.87 18.87 0 0 1-3.478 4.568M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                           />
                           <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M3 3l18 18"
                           />
                        </svg>
                     ) : (
                        <svg
                           className="w-5 h-5"
                           viewBox="0 0 24 24"
                           fill="none"
                           stroke="currentColor"
                        >
                           <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12Z"
                           />
                           <circle cx="12" cy="12" r="3" strokeWidth="2" />
                        </svg>
                     )}
                  </button>
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
                  disabled={!isPasswordValid || isSubmitting}
                  className={`w-full inline-flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                     !isPasswordValid || isSubmitting
                        ? 'bg-[#9E7B9B]/60 cursor-not-allowed'
                        : 'bg-[#9E7B9B] hover:bg-[#8B6B8B] focus:ring-[#9E7B9B]'
                  }`}
                  aria-busy={isSubmitting}
               >
                  {isSubmitting ? (
                     <>
                        <span className="sr-only">Creating account</span>
                        <span className="mr-2">Creating account</span>
                        <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                     </>
                  ) : (
                     'Create Account'
                  )}
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
