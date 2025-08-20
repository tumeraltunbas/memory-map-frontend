import { useMemo, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/authApi';
import { AuthLayout } from '../AuthLayout';

export const ResetPassword = () => {
   const navigate = useNavigate();
   const [searchParams] = useSearchParams();
   const token = useMemo(
      () => searchParams.get('resetPasswordToken') || '',
      [searchParams]
   );

   const [password, setPassword] = useState('');
   const [confirmPassword, setConfirmPassword] = useState('');
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [success, setSuccess] = useState(false);

   const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
   const isPasswordValid = passwordRegex.test(password);
   const isConfirmMatch =
      password === confirmPassword && confirmPassword.length > 0;

   const canSubmit =
      token && isPasswordValid && isConfirmMatch && !isSubmitting;

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!canSubmit) return;
      try {
         setIsSubmitting(true);
         await authAPI.resetPassword(password, token);
         setSuccess(true);
         setTimeout(() => navigate('/login'), 1200);
      } finally {
         setIsSubmitting(false);
      }
   };

   return (
      <AuthLayout
         title="Reset your password"
         subtitle={
            token ? 'Choose a new password' : 'Invalid or missing reset token'
         }
      >
         {success ? (
            <div className="space-y-6">
               <p className="text-sm text-gray-700">
                  Your password has been reset successfully.
               </p>
               <div className="text-sm text-center">
                  <Link
                     to="/login"
                     className="font-medium text-[#9E7B9B] hover:text-[#8B6B8B]"
                  >
                     Go to sign in
                  </Link>
               </div>
            </div>
         ) : token ? (
            <form className="space-y-6" onSubmit={handleSubmit}>
               <div>
                  <label
                     htmlFor="password"
                     className="block text-sm font-medium text-gray-700"
                  >
                     New password
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
                        Must be at least 8 characters, include uppercase,
                        lowercase and a number.
                     </p>
                  )}
               </div>

               <div>
                  <label
                     htmlFor="confirmPassword"
                     className="block text-sm font-medium text-gray-700"
                  >
                     Confirm new password
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
                        className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm ${
                           confirmPassword && !isConfirmMatch
                              ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                              : 'border-gray-300 focus:ring-[#9E7B9B] focus:border-[#9E7B9B]'
                        }`}
                     />
                  </div>
                  {confirmPassword && !isConfirmMatch && (
                     <p className="mt-1 text-xs text-red-600">
                        Passwords do not match.
                     </p>
                  )}
               </div>

               <div>
                  <button
                     type="submit"
                     disabled={!canSubmit}
                     className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        !canSubmit
                           ? 'bg-[#9E7B9B]/60 cursor-not-allowed'
                           : 'bg-[#9E7B9B] hover:bg-[#8B6B8B] focus:ring-[#9E7B9B]'
                     }`}
                  >
                     {isSubmitting ? 'Resetting…' : 'Reset password'}
                  </button>
               </div>

               <div className="text-sm text-center">
                  <Link
                     to="/login"
                     className="font-medium text-[#9E7B9B] hover:text-[#8B6B8B]"
                  >
                     Back to sign in
                  </Link>
               </div>
            </form>
         ) : (
            <div className="text-sm text-gray-700">
               The reset link is invalid. Please request a new one.
            </div>
         )}
      </AuthLayout>
   );
};
